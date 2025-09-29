"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "../ui/button";
import { Title } from "./title";
// import { IProduct } from '@/hooks/use-choose-pizza';

// import { useCart } from '@/hooks/use-cart';

interface Props {
	imageUrl: string;
	name: string;
	price: number;
	loading: boolean;
	onSubmit?: VoidFunction;
	className?: string;
	// items?: IProduct['items'];
	// items?: any;
}

/**
 * Форма выбора продукта
 */

export const ChooseProductForm: React.FC<Props> = ({ name, imageUrl, onSubmit, className, price, loading }) => {
	return (
		<div className={cn(className, "flex flex-col lg:flex-row flex-1 max-h-[90vh] overflow-auto")}>
			<div className="flex items-center justify-center flex-1 relative lg:w-[50%] w-full h-[400px] p-4 md:p-0 ">
				<img
					src={imageUrl}
					alt={name}
					className="relative md:left-2 md:top-2 transition-all z-10 duration-300 w-[200px] h-[200px] md:w-[300px] md:h-[300px] object-contain"
				/>
			</div>

			<div className="bg-gray-50 px-2 py-5 rounded-md mb-3 h-auto overflow-auto lg:w-[50%] w-full">
				<Title text={name} size="md" className="font-extrabold mb-1 text-center" />

				<Button
					onClick={() => onSubmit?.()}
					loading={loading}
					className="h-[55px] px-10 text-base rounded-[18px] w-full mt-5"
				>
					Добавить в корзину за {price} ₽
				</Button>
			</div>
		</div>
	);
};
