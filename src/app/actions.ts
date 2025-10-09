"use server";

import { CheckoutFormValues } from "@/components/shared/checkout/checkout-form-schema";
import { OrderStatus } from "@prisma/client";
import { cookies } from "next/headers";

import { stripe } from "@/lib/stripe";
import type { Stripe } from "stripe";
import { prisma } from "../../prisma/prisma-client";

// const APP_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
// const APP_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://pizza-next-neon.vercel.app";
const APP_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL ??
	(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const VAT_PERCENT = 5; // НДС, %
const DELIVERY_EUR = 12; // Доставка,

export async function createOrder(data: CheckoutFormValues) {
	try {
		const cookisStore = await cookies();

		const cartToken = cookisStore.get("cartToken")?.value;

		if (!cartToken) {
			throw new Error("Cart token not found");
		}

		// Подтягиваем корзину
		const cart = await prisma.cart.findFirst({
			where: { tokenId: cartToken },
			include: {
				items: {
					include: {
						productItem: {
							include: { product: true },
						},
						ingredients: true,
					},
				},
			},
		});

		if (!cart) throw new Error("Cart not found");
		if (!cart.items.length || cart.totalAmount <= 0) throw new Error("Cart is empty");

		// Считаем на СЕРВЕРЕ (в центах, чтобы не ловить округления)
		const itemsCents = Math.round(cart.totalAmount * 100);
		const taxCents = Math.round((itemsCents * VAT_PERCENT) / 100);
		const deliveryCents = Math.round(DELIVERY_EUR * 100);
		const grandCents = itemsCents + taxCents + deliveryCents;

		// Создаём Order в статусе PENDING
		const order = await prisma.order.create({
			data: {
				tokenId: cartToken,
				totalAmount: Math.round(grandCents / 100),
				status: OrderStatus.PENDING,
				items: JSON.stringify(cart.items),
				fullName: `${data.firstname ?? ""} ${data.lastname ?? ""}`.trim(),
				email: data.email ?? "",
				phone: data.phone,
				address: data.address,
				comment: data.comment ?? "",
			},
		});

		// Собираем line_items для Stripe (пример: одна строка общая)
		// Вариант А: одна строка
		const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
			{
				quantity: 1,
				price_data: {
					currency: "eur", // валюта
					// unit_amount: cart.totalAmount * 100, // сумма в центах!
					unit_amount: grandCents,
					product_data: {
						name: `Заказ #${order.id}`,
						description: "Оплата заказа в Next Pizza",
					},
				},
			},
		];
		// Вариант Б (если хочешь разложить позициями):
		// const line_items = [
		//   { quantity: 1, price_data: { currency: "eur", unit_amount: itemsCents,    product_data: { name: "Товары" } } },
		//   { quantity: 1, price_data: { currency: "eur", unit_amount: taxCents,      product_data: { name: `Налог ${VAT_PERCENT}%` } } },
		//   { quantity: 1, price_data: { currency: "eur", unit_amount: deliveryCents, product_data: { name: "Доставка" } } },
		// ];

		const session = await stripe.checkout.sessions.create({
			mode: "payment",
			line_items,
			success_url: `${APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${APP_URL}/failed`,
			metadata: {
				orderId: String(order.id),
				cartToken,
			},
		});

		return session.url ?? null;
	} catch (error) {
		console.log("[CREATE_ORDER] Server error", error);
		return null;
	}
}

//  функция очистки корзины
export async function clearCart(cartToken?: string) {
	try {
		// Если cartToken не передан, пробуем получить из куки
		if (!cartToken) {
			const cookieStore = await cookies();
			cartToken = cookieStore.get("cartToken")?.value;
		}

		if (!cartToken) {
			console.log("[CLEAR_CART] Cart token not found");
			return { success: false, error: "Cart token not found" };
		}

		// Поиск корзины
		const cart = await prisma.cart.findFirst({
			where: { tokenId: cartToken },
			select: { id: true },
		});

		if (!cart) {
			console.log("[CLEAR_CART] Cart not found for token:", cartToken);
			return { success: false, error: "Cart not found" };
		}

		// Удаление элементов корзины
		const deleteResult = await prisma.cartItem.deleteMany({
			where: { cartId: cart.id },
		});
		console.log("[CLEAR_CART] Deleted items count:", deleteResult.count);

		// Обновление суммы корзины
		await prisma.cart.update({
			where: { id: cart.id },
			data: { totalAmount: 0 },
		});
		console.log("[CLEAR_CART] Cart total amount reset for cart:", cart.id);

		return { success: true };
	} catch (error) {
		console.error("[CLEAR_CART] Error:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
