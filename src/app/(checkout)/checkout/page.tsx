"use client";
import { Title } from "@/components/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { createOrder } from "@/app/actions";
import { checkoutFormSchema, CheckoutFormValues } from "@/components/shared/checkout/checkout-form-schema";
import { useCart } from "@/hooks";
import { cn } from "@/lib/utils";
import { useState } from "react";
import toast from "react-hot-toast";
import { CheckoutCart } from "@/components/shared/checkout/checkout-cart";
import { CheckoutPersanalInfo } from "@/components/shared/checkout/checkout-persanal-info";
import { CheckoutAdressForm } from "@/components/shared/checkout/checkout-adress-form";
import { CheckoutSidebar } from "@/components/shared/checkout-sidebar";

export default function CheckoutPage() {
	//
	const [submitting, setSubmitting] = useState(false);

	const { totalAmount, items, loading, removeCartItem, changeItemCount } = useCart();

	const form = useForm<CheckoutFormValues>({
		resolver: zodResolver(checkoutFormSchema),
		defaultValues: {
			email: "",
			firstname: "",
			lastname: "",
			phone: "",
			address: "",
			comment: "",
		},
	});

	const onSubmit: SubmitHandler<CheckoutFormValues> = async (data: CheckoutFormValues) => {
		try {
			setSubmitting(true);
			const url = await createOrder(data);

			toast.success("Заказ успешно оформлен! Перейдите по ссылке для оплаты: ", {
				icon: "✅",
			});

			if (!url) {
				toast.error("Не удалось создать платёжную сессию. Попробуйте ещё раз.");
				setSubmitting(false);
				return;
			}

			toast.success("Перенаправляем на страницу оплаты…");
			window.location.href = url;
		} catch (error) {
			toast.error("Произошла ошибка при оформлении заказа", {
				icon: "❌",
			});
			console.log(error);
			setSubmitting(false);
		}

		// console.log(data);
		// createOrder(data);
	};

	return (
		<div className={cn("mt-10 pb-40")}>
			<Title text="Оформление заказа" size="xl" className="mb-8" />

			<FormProvider {...form}>
				{/*  */}
				<form onSubmit={form.handleSubmit(onSubmit)}>
					{/*  */}
					<div className=" grid grid-cols-1 lg:grid-cols-3 gap-10  ">
						{/* left block - top block */}
						<div className="flex flex-col gap-10 flex-1 lg:col-span-2 sm:col-span-2 ">
							{/*  */}
							<CheckoutCart
								items={items}
								loading={loading}
								removeCartItem={removeCartItem}
								changeItemCount={changeItemCount}
								className={`${loading && "opacity-40 pointer-events-none"}`}
							/>

							{/*  */}
							<CheckoutPersanalInfo className={`${loading && "opacity-40 pointer-events-none"}`} />

							{/* */}
							<CheckoutAdressForm className={`${loading && "opacity-40 pointer-events-none"}`} />
						</div>

						{/* right block - subblock */}
						<div className="flex flex-col gap-10 flex-1 lg:col-span-1 sm:col-span-2 ">
							{/*  */}
							<CheckoutSidebar
								totalAmount={totalAmount}
								loading={loading || submitting}
								className={`${loading && "opacity-40 pointer-events-none"}`}
							/>
							{/*  */}
						</div>
					</div>
				</form>
			</FormProvider>
		</div>
	);
}
