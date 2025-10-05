import { cn } from "@/lib/utils";
import React, { JSX } from "react";
import { FormInput } from "../form/form-input";
import { WhiteBlock } from "../white-block";

interface ICheckoutPersanalInfoProps {
	className?: string;
}

export const CheckoutPersanalInfo: React.FC<ICheckoutPersanalInfoProps> = ({ className }): JSX.Element => {
	return (
		<WhiteBlock title="2. Персональные данные" contentClassName={cn("", className)}>
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
				<FormInput name="firstname" className="text-base " placeholder="Имя" label="Имя" required />
				<FormInput name="email" className="text-base " placeholder="Email" label="Email" required />
				<FormInput name="lastname" className="text-base " placeholder="Фамилия" label="Фамилия" required />

				<FormInput name="phone" className="text-base " placeholder="Телефон" label="Телефон" required isPhone />
			</div>
		</WhiteBlock>
	);
};
