import { cn } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";
import React, { JSX } from "react";
import * as CartItem from "./cart-item-details";
import { CartItemProps } from "./cart-item-details/cart-item-details.types";
import { CountButton } from "./count-button";

interface ICartDriwerItemProps extends CartItemProps {
	className?: string;
}

export const CartDriwerItem: React.FC<ICartDriwerItemProps> = ({
	id,
	imageUrl,
	name,
	price,
	quantity,
	details,
	className,
}): JSX.Element => {
	return (
		<div className={cn("flex bg-white p-5 gap-6 rounded-lg", className)}>
			<CartItem.Image src={imageUrl} className="w-[60px] h-[60px] rounded-md" />

			<div className="flex-1">
				<CartItem.Info name={name} details={details} />

				<hr className="my-3" />

				<div className="flex items-center justify-between">
					<CountButton onClick={(type) => console.log(type)} value={quantity} />

					<div className="flex items-center gap-3">
						<CartItem.Price value={price} />

						<Trash2Icon className="text-gray-400 cursor-pointer hover:text-red-600 " size={16} />
					</div>
				</div>
			</div>
		</div>
	);
};
