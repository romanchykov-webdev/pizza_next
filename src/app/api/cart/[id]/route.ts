import { updateCartTotalAmount } from "@/lib/update-cart-total-amount";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		console.time("PATCH_CART_TOTAL"); // Начало измерения общего времени

		const id = Number(params.id);

		const data = (await req.json()) as { quantity: number };

		const token = req.cookies.get("cartToken")?.value;

		if (!token) {
			return NextResponse.json({ message: "Не удалось обновить корзину" }, { status: 401 });
		}

		console.time("FIND_CART_ITEM"); // Измерение времени поиска элемента

		const cartItem = await prisma.cartItem.findFirst({
			where: {
				id,
			},
		});

		console.timeEnd("FIND_CART_ITEM");

		if (!cartItem) {
			return NextResponse.json({ message: "Не удалось обновить корзину" }, { status: 404 });
		}

		console.time("UPDATE_CART_ITEM"); // Измерение времени обновления элемента

		await prisma.cartItem.update({
			where: {
				id,
			},
			data: {
				quantity: data.quantity,
			},
		});

		console.timeEnd("UPDATE_CART_ITEM");

		console.time("UPDATE_CART_TOTAL"); // Измерение времени обновления общей суммы

		const updateUserCart = await updateCartTotalAmount(token);

		console.timeEnd("UPDATE_CART_TOTAL");

		console.timeEnd("PATCH_CART_TOTAL"); // Конец измерения общего времени

		return NextResponse.json(updateUserCart);

		//
	} catch (error) {
		console.log("[CART_PATCH] Server error", error);

		return NextResponse.json({ message: "Не удалось обновить корзину" }, { status: 500 });
	}
}
