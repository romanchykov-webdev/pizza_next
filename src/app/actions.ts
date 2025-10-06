"use server";

import { CheckoutFormValues } from "@/components/shared/checkout/checkout-form-schema";
import { OrderStatus } from "@prisma/client";
import { cookies } from "next/headers";
import { prisma } from "../../prisma/prisma-client";

export async function createOrder(data: CheckoutFormValues) {
	try {
		const cookisStore = await cookies();

		const cartToken = cookisStore.get("cartToken")?.value;

		if (!cartToken) {
			throw new Error("Cart token not found");
		}

		// находим корзину по токену
		const userCart = await prisma.cart.findFirst({
			include: {
				user: true,
				items: {
					include: {
						ingredients: true,
						productItem: {
							include: {
								product: true,
							},
						},
					},
				},
			},
			where: {
				tokenId: cartToken,
			},
		});

		// если корзина не найдена, то выбрасываем ошибку
		if (!userCart) {
			throw new Error("Cart not found");
		}

		// если корзина пуста, то выбрасываем ошибку
		if (userCart?.totalAmount === 0) {
			throw new Error("Cart is empty");
		}

		// создаем заказ
		const order = await prisma.order.create({
			data: {
				fullName: data.firstname + " " + data.lastname || "",
				email: data.email || "",
				phone: data.phone,
				address: data.address,
				comment: data.comment || "",
				tokenId: cartToken,
				totalAmount: userCart.totalAmount,
				status: OrderStatus.PENDING,
				items: JSON.stringify(userCart.items),
			},
		});

		// обновляем корзину
		await prisma.cart.update({
			where: {
				id: userCart.id,
			},
			data: {
				totalAmount: 0,
			},
		});

		// удаляем все товары из корзины
		await prisma.cartItem.deleteMany({
			where: {
				cartId: userCart.id,
			},
		});

		// TODO:  сделать создание ссылки для оплаты
		//
	} catch (error) {
		console.log(error);
	}
}
