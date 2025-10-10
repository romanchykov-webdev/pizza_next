import { stripe } from "@/lib/stripe";
import { OrderStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "../../../../../prisma/prisma-client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Жестко закодированный секрет для отладки
// const WEBHOOK_SECRET = "whsec_73581fc6215e3bc90a9d8b3c6604909d244169efda1eb3297aed9385cd935ce8";
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
	console.log("[WEBHOOK] Received webhook request");

	const sig = req.headers.get("stripe-signature");
	if (!sig) {
		console.error("[WEBHOOK] No signature provided");
		return NextResponse.json({ error: "No signature" }, { status: 400 });
	}

	// Используем жестко закодированный секрет вместо process.env
	const secret = WEBHOOK_SECRET;
	console.log("[WEBHOOK] Using webhook secret:", secret.substring(0, 5) + "...");

	const rawBody = await req.text();

	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(rawBody, sig, secret);
		console.log("[WEBHOOK] Event received:", event.type);
	} catch (err) {
		const error = err as Error;
		console.error("[WEBHOOK] Bad signature", error.message);
		return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
	}

	try {
		switch (event.type) {
			case "checkout.session.completed": {
				const session = event.data.object as Stripe.Checkout.Session;

				const orderId = Number(session.metadata?.orderId);
				const cartToken = session.metadata?.cartToken;

				if (!orderId || !cartToken) {
					return NextResponse.json({ error: "No orderId/cartToken in metadata" }, { status: 400 });
				}

				// 1) Помечаем заказ оплаченным
				await prisma.order.update({
					where: { id: orderId },
					data: {
						status: OrderStatus.SUCCEEDED,
						paymentId: String(session.payment_intent ?? ""),
					},
				});

				// 2) Очищаем корзину по токену
				const cart = await prisma.cart.findFirst({
					where: { tokenId: cartToken },
					select: { id: true },
				});

				if (cart) {
					await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
					await prisma.cart.update({
						where: { id: cart.id },
						data: { totalAmount: 0 },
					});
				}

				break;
			}

			// Остальной код без изменений...
			case "checkout.session.async_payment_failed":
			case "payment_intent.payment_failed": {
				try {
					// можно пометить заказ отменённым
					// Для обоих типов событий объект может быть разным, поэтому используем узкие типы
					const dataObject = event.data.object as
						| Stripe.PaymentIntent
						| Stripe.Checkout.Session
						| Record<string, unknown>;

					const metadata: Record<string, unknown> | null =
						(dataObject as Stripe.PaymentIntent)?.metadata ??
						(dataObject as Stripe.Checkout.Session)?.metadata ??
						null;

					console.log("[WEBHOOK] Payment failed event:", {
						type: event.type,
						metadata,
					});

					const orderId = Number((metadata as Record<string, unknown> | null)?.orderId);
					if (orderId) {
						await prisma.order.update({
							where: { id: orderId },
							data: { status: OrderStatus.CANCELLED },
						});
						console.log("[WEBHOOK] Order cancelled:", orderId);
					} else {
						console.error("[WEBHOOK] No orderId in metadata for failed payment");
					}
				} catch (err) {
					console.error("[WEBHOOK] Error in payment_failed handler:", err);
					return NextResponse.json({ error: "Handler error in payment failed" }, { status: 500 });
				}
				break;
			}

			default:
				// для прочих событий ничего не делаем
				console.log("[WEBHOOK] Unhandled event type:", event.type);
				break;
		}

		console.log("[WEBHOOK] Successfully processed event:", event.type);
		return NextResponse.json({ received: true });
	} catch (err) {
		console.error("[WEBHOOK] Handler error", err);
		return NextResponse.json({ error: "Handler error" }, { status: 500 });
	}
}
