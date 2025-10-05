"use client";
import { CheckoutItemOrder, CheckoutItemSkeleton, CheckoutSidebar, Title, WhiteBlock } from "@/components/shared";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PizzaSize, PizzaType } from "@/constants/pizza";
import { useCart } from "@/hooks";
import { getCartItemDetails } from "@/lib/get-cart-item-details";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
	//

	const { totalAmount, items, loading, removeCartItem, addCartItem, changeItemCount } = useCart();

	return (
		<div className={cn("mt-10 pb-40")}>
			<Title text="Оформление заказа" size="xl" className="mb-8" />

			<div className=" grid grid-cols-1 lg:grid-cols-3 gap-10  ">
				{/* left block - top block */}
				<div className="flex flex-col gap-10 flex-1 lg:col-span-2 sm:col-span-2 ">
					<WhiteBlock title="1. Корзина" contentClassName="flex flex-col gap-5">
						{items.length > 0 ? (
							items.map((item) => (
								<CheckoutItemOrder
									key={item.id}
									name={item.name}
									loading={loading}
									price={item.price}
									imageUrl={item.imageUrl}
									details={getCartItemDetails(
										item.ingredients,
										item.pizzaType as PizzaType,
										item.pizzaSize as PizzaSize,
									)}
									quantity={item.quantity}
									id={item.id}
									// onClickCountButton={(type) => onClickCountButton(item.id, item.quantity, type)}
									onClickCountButton={(type) => changeItemCount(item.id, item.quantity, type)}
									onClickRemove={() => removeCartItem(item.id)}
								/>
							))
						) : (
							<CheckoutItemSkeleton />
						)}
					</WhiteBlock>

					<WhiteBlock title="2. Персональные данные">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
							<Input name="name" className="text-base h-[50px]" placeholder="Имя" />
							<Input name="lastname" className="text-base h-[50px]" placeholder="Фамилия" />
							<Input name="email" className="text-base h-[50px]" placeholder="Email" />
							<Input name="phone" className="text-base h-[50px]" placeholder="Телефон" />
						</div>
					</WhiteBlock>

					{/* adres comment block */}
					<WhiteBlock title="3. Адрес и комментарий">
						<div className="flex flex-col gap-5">
							<Input name="address" className="text-base h-[50px]" placeholder="Адрес" />
							<Textarea rows={5} name="comment" placeholder="Комментарий к заказу" />
						</div>
					</WhiteBlock>
				</div>

				{/* right block - subblock */}
				<div className="flex flex-col gap-10 flex-1 lg:col-span-1 sm:col-span-2 ">
					<CheckoutSidebar totalAmount={totalAmount} />
				</div>
			</div>
		</div>
	);
}
