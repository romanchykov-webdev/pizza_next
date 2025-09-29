"use client";

import { ChoosePizzaForm, ChooseProductForm } from "@/components/shared";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCartStore } from "@/store";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { IProduct } from "../../../../@types/prisma";

interface Props {
	product: IProduct;
}

export const ChooseProductModal: React.FC<Props> = ({ product }) => {
	//
	const router = useRouter();

	const firstItem = product.items[0];

	const isPizzaForm = Boolean(firstItem.pizzaType);

	const addCartItem = useCartStore((state) => state.addCartItem);

	const loading = useCartStore((state) => state.loading);

	const onSubmit = async (productItemId?: number, ingredients?: number[]) => {
		try {
			const itemId = productItemId ?? firstItem.id;

			await addCartItem({
				productItemId: itemId,
				ingredients,
			});

			toast.success(product.name + " добавлен в корзину");

			router.back();
			//
		} catch (error) {
			toast.error("Произошла ошибка при добавлении в корзину");
			console.error(error);
		}
	};

	return (
		<Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
			<DialogContent className="p-0 w-full max-w-[1060px] bg-white overflow-auto   lg:w-[1060px] h-[90vh] lg:h-auto rounded-lg">
				<VisuallyHidden>
					<DialogTitle>{"dialog title"}</DialogTitle>
				</VisuallyHidden>

				{isPizzaForm ? (
					<ChoosePizzaForm
						imageUrl={product.imageUrl}
						name={product.name}
						ingredients={product.ingredients}
						items={product.items ?? []}
						onSubmit={onSubmit}
						loading={loading}
					/>
				) : (
					<ChooseProductForm
						imageUrl={product.imageUrl}
						name={product.name}
						price={firstItem.price}
						onSubmit={onSubmit}
						loading={loading}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
};
