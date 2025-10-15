"use server";

import { CheckoutFormValues } from "@/components/shared/checkout/checkout-form-schema";
import { OrderStatus, Prisma } from "@prisma/client";
import { cookies } from "next/headers";

import { stripe } from "@/lib/stripe";
import { sendTelegramMessage } from "@/lib/telegram";
import type { Stripe } from "stripe";
import { prisma } from "../../prisma/prisma-client";

import { mapPizzaTypes } from "@/constants/pizza";
import { calcCatItemTotalPrice } from "@/lib/calc-cart-item-total-price";
import { getUserSession } from "@/lib/get-user-session";
import { hashSync } from "bcrypt";
import { CartItemDTO } from "../../services/dto/cart.dto";

// const APP_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
// const APP_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://pizza-next-neon.vercel.app";
const APP_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL ??
	(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

const VAT_PERCENT = 5; // НДС, %
const DELIVERY_EUR = 12; // Доставка,

// функция создания заказа
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
				// items: JSON.stringify(cart.items),
				items: cart.items,
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

//  заказ без онлайн-оплаты (оплата курьеру) Telegram-уведомление
export async function createCashOrder(data: CheckoutFormValues) {
	try {
		const cookieStore = await cookies();
		const cartToken = cookieStore.get("cartToken")?.value;

		if (!cartToken) throw new Error("Cart token not found");

		const cart = await prisma.cart.findFirst({
			where: { tokenId: cartToken },
			include: {
				items: {
					include: {
						productItem: { include: { product: true } },
						ingredients: true,
					},
				},
			},
		});

		if (!cart) throw new Error("Cart not found");
		if (!cart.items.length || cart.totalAmount <= 0) throw new Error("Cart is empty");

		const itemsCents = Math.round(cart.totalAmount * 100);
		const taxCents = Math.round((itemsCents * VAT_PERCENT) / 100);
		const deliveryCents = Math.round(DELIVERY_EUR * 100);
		const grandCents = itemsCents + taxCents + deliveryCents;

		const order = await prisma.order.create({
			data: {
				tokenId: cartToken,
				totalAmount: Math.round(grandCents / 100),
				status: OrderStatus.PENDING, // ждёт подтверждения оператором
				//
				items: cart.items,
				fullName: `${data.firstname ?? ""} ${data.lastname ?? ""}`.trim(),
				email: data.email ?? "",
				phone: data.phone,
				address: data.address,
				comment: data.comment ?? "",
				paymentId: "COD", // метка, что оплата будет курьеру
			},
		});

		// Детализация позиций
		const lines: string[] = [];
		for (const it of cart.items) {
			const qty = it.quantity ?? 1;
			const name = it.productItem?.product?.name ?? "Товар";
			const size = (it.pizzaSize ?? it.productItem?.size) ? ` (${it.pizzaSize ?? it.productItem?.size} см)` : "";

			// тип теста: берём из item.type, если нет — из productItem.pizzaType
			const doughType = it.type ?? it.productItem?.pizzaType;
			const doughName = doughType ? mapPizzaTypes[doughType as keyof typeof mapPizzaTypes] : undefined;
			const doughLine = doughName ? `, тесто: ${doughName}` : "";

			const ing = (it.ingredients ?? []).map((x) => x.name).filter(Boolean);
			const ingLine = ing.length ? `\n  + Ингредиенты: ${ing.join(", ")}` : "";

			// сумма позиции (база + ингредиенты) * количество
			const itemSum = calcCatItemTotalPrice(it as CartItemDTO);

			lines.push(`${qty} x ${name}${size}${doughLine}${ingLine} - ${itemSum} zł`);
		}

		const msg: string[] = [
			"🛵 Новый заказ (оплата курьеру)",
			`№${order.id}`,
			`Сумма: €${(grandCents / 100).toFixed(2)}`,
			"",
			"Состав:",
			...lines.map((l) => `• ${l}`),
			"",
			`Клиент: ${order.fullName}`,
			`Телефон: ${order.phone}`,
			`Email: ${order.email}`,
			`Адрес: ${order.address}`,
			`Комментарий: ${order.comment || "-"}`,
		];

		await sendTelegramMessage(msg.join("\n"));

		// Очищаем корзину сразу после оформления
		await clearCart(cartToken);

		return { success: true, orderId: order.id };
	} catch (error) {
		console.error("[CREATE_CASH_ORDER] Server error", error);
		return { success: false };
	}
}

//  функция очистки корзины временная
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

// функция обновления информации о пользователе
export async function updateUserInfo(body: Prisma.UserUpdateInput) {
	try {
		const currentUser = await getUserSession();

		if (!currentUser) {
			throw new Error("Пользователь не найден");
		}

		const findUser = await prisma.user.findFirst({
			where: {
				id: Number(currentUser.id),
			},
		});

		await prisma.user.update({
			where: {
				id: Number(currentUser.id),
			},
			data: {
				fullName: body.fullName,
				email: body.email,
				password: body.password ? hashSync(body.password as string, 10) : findUser?.password,
			},
		});
	} catch (err) {
		console.log("Error [UPDATE_USER]", err);
		throw err;
	}
}

// функция регистрации пользователя
export async function registerUser(body: Prisma.UserCreateInput) {
	try {
		const user = await prisma.user.findFirst({
			where: {
				email: body.email,
			},
		});

		if (user) {
			if (!user.verified) {
				throw new Error("Почта не подтверждена");
			}

			throw new Error("Пользователь уже существует");
		}

		// const createdUser = await prisma.user.create({
		// 	data: {
		// 		...body,
		// 		password: hashSync(body.password, 10),
		// 	},
		// });

		// Создаём пользователя и сразу помечаем как верифицированного
		const createdUser = await prisma.user.create({
			data: {
				fullName: body.fullName,
				email: body.email,
				password: hashSync(body.password, 10),
				// verified: new Date(),
				// provider: "credentials",
				// providerId: undefined,
			},
		});

		// const code = Math.floor(100000 + Math.random() * 900000).toString();

		// await prisma.verificationCode.create({
		// 	data: {
		// 		code,
		// 		userId: createdUser.id,
		// 		expiresAt: new Date(Date.now() + 10 * 60 * 1000),
		// 	},
		// });

		// console.log(createdUser);

		// const html = `
		// <p>Код подтверждения: <h2>${code}</h2></p>
		// <p><a href="http://localhost:3000/api/auth/verify?code=${code}">Подтвердить регистрацию</a></p>
		// `;

		// await sendEmail(createdUser.email, "Next Pizza / Подтверждение регистрации", html);

		return { success: true, userId: createdUser.id };
	} catch (error) {
		console.log("Error [CREATE_USER]", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
