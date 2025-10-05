import { cn } from "@/lib/utils";
import React, { ElementType, JSX } from "react";

interface ICheckoutItemDetailsProps {
	title?: string;
	value?: string;
	className?: string;
	priceClassName?: string;
	icon?: ElementType;
}

export const CheckoutItemDetails: React.FC<ICheckoutItemDetailsProps> = ({
	className,
	priceClassName,
	title,
	value,
	icon: Icon,
}): JSX.Element => {
	return (
		<div className={cn("flex my-5 border-b border-dashed border-b-neutral-200", className, priceClassName)}>
			<div className=" flex flex-1 items-center justify-between">
				<div className="flex items-center gap-2">
					{Icon && <Icon className="text-neutral-500" size={20} />}
					<span className="text-lg text-neutral-500">{title} : </span>
				</div>

				<span className={cn("text-xl font-extrabold", priceClassName)}>{value}&nbsp;zł</span>
			</div>
		</div>
	);
};
