"use client";

import React, { JSX, useState } from "react";

import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

import { PizzaSize, PizzaType } from "@/constants/pizza";
import { getCartItemDetails } from "@/lib";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui";
import { CartDriwerItem } from "./cart-driwer-item";

import EmptyCartSvg from "@/assets/basket-empty.svg";
import { useCart } from "@/hooks";
import Image from "next/image";

export const CartDrawer: React.FC<React.PropsWithChildren> = ({ children }): JSX.Element => {
	//
	const { totalAmount, items, loading, removeCartItem, changeItemCount } = useCart();

	const [redirecting, setRedirecting] = useState(false);

	return (
		<Sheet>
			<SheetTrigger asChild>{children}</SheetTrigger>
			<SheetContent side="right" className="flex flex-col justify-between pb-0 bg-[#F4F1EE] sm:max-w-md w-full ">
				<SheetHeader>
					<SheetTitle>
						{items.length > 0 && (
							<span>
								В корзине <span className="font-bold">{items.length} товаров</span>
							</span>
						)}
					</SheetTitle>
				</SheetHeader>

				<div className="flex flex-1 h-full flex-col overflow-auto scrollbar gap-2 ">
					{/* <div className="flex flex-col overflow-auto scrollbar gap-2 max-h-[calc(100vh-200px)]"> */}
					{items.length > 0 ? (
						items.map((item) => (
							<CartDriwerItem
								key={item.id}
								loading={loading}
								id={item.id}
								imageUrl={item.imageUrl}
								details={getCartItemDetails(
									item.ingredients,
									item.pizzaType as PizzaType,
									item.pizzaSize as PizzaSize,
								)}
								name={item.name}
								price={item.price}
								quantity={item.quantity}
								// onClickCountButton={(type) => onClickCountButton(item.id, item.quantity, type)}
								onClickCountButton={(type) => changeItemCount(item.id, item.quantity, type)}
								onClickRemove={() => removeCartItem(item.id)}
							/>
						))
					) : (
						<div className="flex flex-1 flex-col p-4 items-center justify-center min-h-[300px]">
							<Image src={EmptyCartSvg} alt="Пустая корзина" width={300} height={300} />
							<p className="mt-4 text-gray-500 text-center mb-10">Ваша корзина пуста</p>

							<SheetClose asChild>
								<Button className="w-full h-12 text-base">
									<ArrowLeft className="w-5 mr-5" />
									Вернуться назад
								</Button>
							</SheetClose>
						</div>
					)}
				</div>

				{items.length > 0 && (
					<SheetFooter className="bg-white p-4 sm:p-8 mt-auto sticky bottom-0 left-0 right-0">
						<div className="w-full">
							<div className="flex mb-4">
								<span className="flex flex-1 text-lg text-neutral-500">
									Итого
									<div className="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2" />
								</span>

								<span className="font-bold text-lg">{totalAmount} zł</span>
							</div>

							{/* <Link href="/checkout" className="w-full">
								<Button
									onClick={() => setRedirecting(true)}
									loading={loading || redirecting}
									// disabled={items.length === 0}
									type="submit"
									className="w-full h-12 text-base"
								>
									Оформить заказ
									<ArrowRight className="w-5 ml-2" />
								</Button>
							</Link> */}
							<SheetClose asChild>
								<Button
									asChild
									onClick={() => setRedirecting(true)}
									loading={loading || redirecting}
									className="w-full h-12 text-base"
								>
									<Link href="/checkout">
										Оформить заказ <ArrowRight className="w-5 ml-2" />
									</Link>
								</Button>
							</SheetClose>
						</div>
					</SheetFooter>
				)}
			</SheetContent>
		</Sheet>
	);
};
