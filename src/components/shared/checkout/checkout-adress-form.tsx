import React, { JSX } from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { WhiteBlock } from "../white-block";
import { Input } from "@/components/ui/input";

interface ICheckoutAdressFormProps {
	className?: string;
}

export const CheckoutAdressForm: React.FC<ICheckoutAdressFormProps> = ({ className }): JSX.Element => {
	return (
		<WhiteBlock title="3. Адрес и комментарий" contentClassName={cn("", className)}>
			<div className="flex flex-col gap-5">
				<Input name="address" className="text-base " placeholder="Адрес" />
				<Textarea rows={5} name="comment" placeholder="Комментарий к заказу" />
			</div>
		</WhiteBlock>
	);
};
