import { updateCartTotalAmount } from "@/lib/update-cart-total-amount";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/prisma-client";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
	try {
		const id = Number(params.id);

		const data = (await req.json()) as { quantity: number };

		const token = req.cookies.get("cartToken")?.value;

		if (!token) {
			return NextResponse.json({ message: "Не удалось обновить корзину" }, { status: 401 });
		}

		const cartItem = await prisma.cartItem.findFirst({
			where: {
				id,
			},
		});

		if (!cartItem) {
			return NextResponse.json({ message: "Не удалось обновить корзину" }, { status: 404 });
		}

		await prisma.cartItem.update({
			where: {
				id,
			},
			data: {
				quantity: data.quantity,
			},
		});

		const updateUserCart = await updateCartTotalAmount(token);

		return NextResponse.json(updateUserCart);

		//
	} catch (error) {
		console.log("[CART_PATCH] Server error", error);

		return NextResponse.json({ message: "Не удалось обновить корзину" }, { status: 500 });
	}
}
