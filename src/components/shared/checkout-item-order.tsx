"use client";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import React, { JSX } from "react";
import * as CartItemDetails from "./cart-item-details";
import { CartItemProps } from "./cart-item-details/cart-item-details.types";
import { CountButtonProps } from "./count-button";

interface Props extends CartItemProps {
	name: string;
	price: number;
	imageUrl: string;
	details: string;
	quantity: number;
	className?: string;
	onClickRemove: () => void;
	onClickCountButton: CountButtonProps["onClick"];
}

export const CheckoutItemOrder: React.FC<Props> = ({
	name,
	price,
	imageUrl,
	details,
	quantity,
	className,
	onClickRemove,
	onClickCountButton,
}): JSX.Element => {
	return (
		<div
			className={cn("flex flex-col lg:flex-row items-center justify-between shadow-md rounded-lg p-5", className)}
		>
			<div className="flex items-center gap-5 flex-1 mr-10">
				<CartItemDetails.Image src={imageUrl} />
				<CartItemDetails.Info name={name} details={details} />
			</div>

			<div className="flex mt-10 lg:mt-0 items-center gap-5 justify-between ">
				<CartItemDetails.Price value={price} />

				<div className="flex items-center gap-5 ml-20">
					<CartItemDetails.CountButton onClick={onClickCountButton} value={quantity} />
					<button onClick={onClickRemove}>
						<X className="text-gray-400 cursor-pointer hover:text-gray-600" size={20} />
					</button>
				</div>
			</div>
		</div>
	);
};
