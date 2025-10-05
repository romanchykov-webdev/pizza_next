import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React, { JSX } from "react";
import { useFormContext } from "react-hook-form";
import { ClearButton } from "../clear-button";
import { ErrorText } from "../error-text";
import { RequiredSymbol } from "../required-symbol";

interface IFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	name: string;
	// placeholder: string;
	label: string;
	required?: boolean;
	className?: string;
	isPhone?: boolean;
}

export const FormInput: React.FC<IFormInputProps> = ({
	name,
	label,
	required,
	className,
	isPhone,
	...props
}): JSX.Element => {
	//
	const {
		register,
		formState: { errors },
		watch,
		setValue,
	} = useFormContext();
	const value = watch(name);
	const errorText = errors[name]?.message as string;

	const onClickClear = () => {
		setValue(name, "");
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (isPhone) {
			// Разрешим только цифры (и опционально '+' в начале)
			const next = e.target.value
				.replace(/[^\d+]/g, "") // только цифры и '+'
				.replace(/(?!^)\+/g, ""); // '+' только в начале
			setValue(name, next, { shouldValidate: true });
		} else {
			setValue(name, e.target.value, { shouldValidate: true });
		}
	};

	//
	return (
		<div className={cn("", className)}>
			{label && (
				<p className="font-medium mb-2">
					{label}
					{required && <RequiredSymbol />}
				</p>
			)}

			<div className="relative">
				<Input
					{...register(name)}
					value={value ?? ""}
					onChange={onChange}
					type={isPhone ? "tel" : (props.type ?? "text")}
					inputMode={isPhone ? "numeric" : props.inputMode}
					autoComplete={isPhone ? "tel" : props.autoComplete}
					pattern={isPhone ? "[0-9+]*" : props.pattern}
					className="text-md"
					{...props}
				/>
				{value && <ClearButton onClick={onClickClear} />}
			</div>

			{errorText && <ErrorText text={errorText} className="mt-2" />}
		</div>
	);
};
