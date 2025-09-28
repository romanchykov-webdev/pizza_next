"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";
import { Title } from "./title";
// import { IProduct } from '@/hooks/use-choose-pizza';
import toast from "react-hot-toast";

// import { useCart } from '@/hooks/use-cart';

interface Props {
	imageUrl: string;
	name: string;
	className?: string;
	// items?: IProduct['items'];
	items?: any;
	onClickAdd?: VoidFunction;
}

export const ChooseProductForm: React.FC<Props> = ({ name, items, imageUrl, onClickAdd, className }) => {
	// const { addCartItem, loading } = useCart();

	const productItem = items?.[0];

	if (!productItem) {
		throw new Error("Продукт не найден");
	}

	const productPrice = productItem.price;

	const handleClickAdd = async () => {
		try {
			// await addCartItem({
			//   productItemId: productItem.id,
			//   quantity: 1,
			// });
			toast.success("Товар добавлен в корзину");
		} catch (error) {
			console.error(error);
			toast.error("Произошла ошибка при добавлении в корзину");
		}

		onClickAdd?.();
	};

	return (
		<div className={cn(className, "flex flex-col md:flex-row flex-1")}>
			<div className="flex items-center justify-center flex-1 relative w-full p-4 md:p-0">
				<img
					src={imageUrl}
					alt={name}
					className="relative md:left-2 md:top-2 transition-all z-10 duration-300 w-[200px] h-[200px] md:w-[300px] md:h-[300px] object-contain"
				/>
			</div>

			<div className="w-full md:w-[490px] bg-[#FCFCFC] p-4 md:p-7">
				<Title text={name} size="md" className="font-extrabold mb-1" />

				<Button
					loading={false}
					onClick={handleClickAdd}
					className="h-[55px] px-10 text-base rounded-[18px] w-full mt-5"
				>
					Добавить в корзину за {productPrice} ₽
				</Button>
			</div>
		</div>
	);
};
