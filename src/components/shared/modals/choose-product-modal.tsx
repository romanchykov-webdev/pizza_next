"use client";

import { ChoosePizzaForm, ChooseProductForm } from "@/components/shared";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useRouter } from "next/navigation";
import React from "react";
import { IProduct } from "../../../../@types/prisma";

interface Props {
	product: IProduct;
}

export const ChooseProductModal: React.FC<Props> = ({ product }) => {
	const router = useRouter();
	const isPizzaForm = Boolean(product.items[0].pizzaType);

	const onCloseModal = () => {
		router.back();
	};

	return (
		<Dialog open={Boolean(product)} onOpenChange={onCloseModal}>
			<DialogContent className="p-0 w-full max-w-[1060px] bg-white overflow-auto  lg:w-[1060px] h-[90vh] lg:h-auto rounded-lg">
				<VisuallyHidden>
					<DialogTitle>{"dialog title"}</DialogTitle>
				</VisuallyHidden>

				{isPizzaForm ? (
					<ChoosePizzaForm
						imageUrl={product.imageUrl}
						name={product.name}
						items={product.items ?? []}
						onClickAdd={onCloseModal}
						ingredients={product.ingredients}
					/>
				) : (
					<ChooseProductForm
						imageUrl={product.imageUrl}
						name={product.name}
						items={product.items ?? []}
						onClickAdd={onCloseModal}
					/>
				)}
			</DialogContent>
		</Dialog>
	);
};
