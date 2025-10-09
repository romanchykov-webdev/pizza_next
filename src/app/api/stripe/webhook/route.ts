import { prisma } from "@/../prisma/prisma-client";
import { stripe } from "@/lib/stripe";
import { OrderStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

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
	} catch (err: any) {
		console.error("[WEBHOOK] Bad signature", err?.message);
		return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
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
			// case "checkout.session.completed": {
			// 	try {
			// 		console.log("[WEBHOOK] Processing checkout.session.completed");
			// 		const session = event.data.object as Stripe.Checkout.Session;

			// 		// Логируем полную структуру сессии для отладки
			// 		console.log(
			// 			"[WEBHOOK] Full session data:",
			// 			JSON.stringify(
			// 				{
			// 					id: session.id,
			// 					payment_intent: session.payment_intent,
			// 					metadata: session.metadata,
			// 					customer: session.customer,
			// 					amount_total: session.amount_total,
			// 				},
			// 				null,
			// 				2,
			// 			),
			// 		);

			// 		const orderId = Number(session.metadata?.orderId);
			// 		const cartToken = session.metadata?.cartToken;

			// 		console.log("[WEBHOOK] Extracted data:", {
			// 			orderId,
			// 			cartToken,
			// 			paymentIntent: session.payment_intent,
			// 		});

			// 		if (!orderId) {
			// 			console.error("[WEBHOOK] No orderId in metadata");
			// 			return NextResponse.json({ error: "No orderId in metadata" }, { status: 400 });
			// 		}

			// 		if (!cartToken) {
			// 			console.error("[WEBHOOK] No cartToken in metadata");
			// 			return NextResponse.json({ error: "No cartToken in metadata" }, { status: 400 });
			// 		}

			// 		try {
			// 			// Проверяем существование заказа
			// 			const orderExists = await prisma.order.findUnique({
			// 				where: { id: orderId },
			// 				select: { id: true },
			// 			});

			// 			if (!orderExists) {
			// 				console.error("[WEBHOOK] Order not found:", orderId);
			// 				return NextResponse.json({ error: "Order not found" }, { status: 404 });
			// 			}

			// 			console.log("[WEBHOOK] Order exists, updating status");

			// 			// 1) помечаем заказ оплаченным
			// 			await prisma.order.update({
			// 				where: { id: orderId },
			// 				data: {
			// 					status: OrderStatus.SUCCEEDED,
			// 					paymentId: String(session.payment_intent ?? ""),
			// 				},
			// 			});
			// 			console.log("[WEBHOOK] Order updated:", orderId);
			// 		} catch (err) {
			// 			console.error("[WEBHOOK] Error updating order:", err);
			// 			return NextResponse.json({ error: "Error updating order" }, { status: 500 });
			// 		}

			// 		try {
			// 			console.log("[WEBHOOK] Finding cart for token:", cartToken);
			// 			// 2) очищаем корзину по токену
			// 			const cart = await prisma.cart.findFirst({
			// 				where: { tokenId: cartToken },
			// 				select: { id: true },
			// 			});

			// 			if (!cart) {
			// 				console.error("[WEBHOOK] Cart not found for token:", cartToken);
			// 				return NextResponse.json({ error: "Cart not found" }, { status: 404 });
			// 			}

			// 			console.log("[WEBHOOK] Found cart:", cart.id);

			// 			// Удаляем все товары из корзины
			// 			console.log("[WEBHOOK] Deleting cart items for cart:", cart.id);
			// 			const deleteResult = await prisma.cartItem.deleteMany({
			// 				where: { cartId: cart.id },
			// 			});
			// 			console.log("[WEBHOOK] Cart items deleted:", deleteResult.count);

			// 			// Обновляем сумму корзины
			// 			console.log("[WEBHOOK] Updating cart total amount");
			// 			await prisma.cart.update({
			// 				where: { id: cart.id },
			// 				data: { totalAmount: 0 },
			// 			});
			// 			console.log("[WEBHOOK] Cart total amount reset for cart:", cart.id);
			// 		} catch (err) {
			// 			console.error("[WEBHOOK] Error clearing cart:", err);
			// 			return NextResponse.json({ error: "Error clearing cart" }, { status: 500 });
			// 		}
			// 	} catch (err) {
			// 		console.error("[WEBHOOK] Error in checkout.session.completed handler:", err);
			// 		return NextResponse.json({ error: "Handler error in completed session" }, { status: 500 });
			// 	}
			// 	break;
			// }

			// case "checkout.session.completed": {
			// 	try {
			// 		console.log("[WEBHOOK] Processing checkout.session.completed");
			// 		const session = event.data.object as Stripe.Checkout.Session;

			// 		// Логируем полную структуру сессии для отладки
			// 		console.log("[WEBHOOK] Full session data:", JSON.stringify(session, null, 2));

			// 		// Просто возвращаем успешный ответ без выполнения операций с БД
			// 		return NextResponse.json({ received: true });
			// 	} catch (err) {
			// 		console.error("[WEBHOOK] Error in checkout.session.completed handler:", err);
			// 		return NextResponse.json({ error: "Handler error in completed session" }, { status: 500 });
			// 	}
			// }

			// Остальной код без изменений...
			case "checkout.session.async_payment_failed":
			case "payment_intent.payment_failed": {
				try {
					// можно пометить заказ отменённым
					const anyObj = event.data.object as any;
					console.log("[WEBHOOK] Payment failed event:", {
						type: event.type,
						metadata: anyObj?.metadata,
					});

					const orderId = Number(anyObj?.metadata?.orderId); // если метадата есть
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
