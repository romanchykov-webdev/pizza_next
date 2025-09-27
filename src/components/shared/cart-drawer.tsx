"use client";

import React, { JSX } from "react";

import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

import { getCartItemDetails } from "@/lib";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui";
import { CartDriwerItem } from "./cart-driwer-item";

interface ICartDrawerProps {
	className?: string;
}

export const CartDrawer: React.FC<React.PropsWithChildren<ICartDrawerProps>> = ({
	className,
	children,
}): JSX.Element => {
	return (
		<Sheet>
			<SheetTrigger asChild>{children}</SheetTrigger>
			<SheetContent className="flex flex-col justify-between pb-0 bg-[#F4F1EE] ">
				<SheetHeader>
					<SheetTitle>
						В корзине <span className="font-bold">3 товаров</span>
					</SheetTitle>
				</SheetHeader>

				<div className="flex flex-1 h-full flex-col overflow-auto scrollbar gap-2 ">
					<CartDriwerItem
						id={1}
						imageUrl="https://media.dodostatic.net/image/r:233x233/11EE7D610CF7E265B7C72BE5AE757CA7.webp"
						details={getCartItemDetails(2, 30, [{ name: "Цыпленок," }, { name: "моцарелла," }])}
						name={"Чоризо фреш"}
						price={543}
						quantity={1}
					/>
				</div>

				<SheetFooter className=" bg-white p-8">
					<div className="w-full">
						<div className="flex mb-4">
							<span className="flex flex-1 text-lg text-neutral-500">
								Итого
								<div className="flex-1 border-b border-dashed border-b-neutral-200 relative -top-1 mx-2" />
							</span>

							<span className="font-bold text-lg">{/* {totalAmount} */}500 ₽</span>
						</div>

						<Link href="/cart">
							<Button
								// onClick={() => setRedirecting(true)}
								// loading={loading || redirecting}
								type="submit"
								className="w-full h-12 text-base"
							>
								Оформить заказ
								<ArrowRight className="w-5 ml-2" />
							</Button>
						</Link>
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
};
