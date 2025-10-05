"use client";
import { CheckoutAdressForm, CheckoutCart, CheckoutPersanalInfo, CheckoutSidebar, Title } from "@/components/shared";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

import { checkoutFormSchema, CheckoutFormValues } from "@/components/shared/checkout/checkout-form-schema";
import { useCart } from "@/hooks";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
	//

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

	const onSubmit: SubmitHandler<CheckoutFormValues> = (data: CheckoutFormValues) => {
		console.log(data);
	};

	return (
		<div className={cn("mt-10 pb-40")}>
			<Title text="Оформление заказа" size="xl" className="mb-8" />

			<FormProvider {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<div className=" grid grid-cols-1 lg:grid-cols-3 gap-10  ">
						{/* left block - top block */}
						<div className="flex flex-col gap-10 flex-1 lg:col-span-2 sm:col-span-2 ">
							{/*  */}
							<CheckoutCart
								items={items}
								loading={loading}
								removeCartItem={removeCartItem}
								changeItemCount={changeItemCount}
							/>

							{/*  */}
							<CheckoutPersanalInfo />

							{/* */}
							<CheckoutAdressForm />
						</div>

						{/* right block - subblock */}
						<div className="flex flex-col gap-10 flex-1 lg:col-span-1 sm:col-span-2 ">
							<CheckoutSidebar totalAmount={totalAmount} />
						</div>
					</div>
				</form>
			</FormProvider>
		</div>
	);
}
