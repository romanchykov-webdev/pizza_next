"use client";

import React, { JSX, useEffect } from "react";

import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { PizzaSize, PizzaType } from "@/constants/pizza";
import { getCartItemDetails } from "@/lib";
import { useCartStore } from "@/store";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui";
import { CartDriwerItem } from "./cart-driwer-item";

import EmptyCartSvg from "@/assets/basket-empty.svg";
import Image from "next/image";

interface ICartDrawerProps {
	className?: string;
}

export const CartDrawer: React.FC<React.PropsWithChildren<ICartDrawerProps>> = ({ children }): JSX.Element => {
	// const [totalAmount, fetchCartItems, items] = useCartStore((state) => [
	// 	state.totalAmount,
	// 	state.fetchCartItems,
	// 	state.items,
	// ]);
	const totalAmount = useCartStore((state) => state.totalAmount);
	const fetchCartItems = useCartStore((state) => state.fetchCartItems);
	const items = useCartStore((state) => state.items);
	const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
	const loading = useCartStore((state) => state.loading);
	const removeCartItem = useCartStore((state) => state.removeCartItem);

	useEffect(() => {
		fetchCartItems();
	}, [fetchCartItems]);

	const onClickCountButton = (id: number, quantity: number, type: "plus" | "minus") => {
		// console.log(id, quantity, type);
		const newQuantity = type === "plus" ? quantity + 1 : quantity - 1;
		updateItemQuantity(id, newQuantity);
	};

	// console.log("loading", loading);
	console.log("items", items);

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
								details={
									item.pizzaType && item.pizzaSize
										? getCartItemDetails(
												item.ingredients,
												item.pizzaType as PizzaType,
												item.pizzaSize as PizzaSize,
											)
										: ""
								}
								name={item.name}
								price={item.price}
								quantity={item.quantity}
								onClickCountButton={(type) => onClickCountButton(item.id, item.quantity, type)}
								onClickRemove={() => removeCartItem(item.id)}
							/>
						))
					) : (
						<div className="flex flex-1 flex-col items-center justify-center min-h-[300px]">
							<Image src={EmptyCartSvg} alt="Пустая корзина" width={300} height={300} />
							<p className="mt-4 text-gray-500 text-center">Ваша корзина пуста</p>
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

							<Link href="/cart" className="w-full">
								<Button
									// onClick={() => setRedirecting(true)}
									// loading={loading || redirecting}
									loading={loading}
									disabled={items.length === 0}
									type="submit"
									className="w-full h-12 text-base"
								>
									Оформить заказ
									<ArrowRight className="w-5 ml-2" />
								</Button>
							</Link>
						</div>
					</SheetFooter>
				)}
			</SheetContent>
		</Sheet>
	);
};
