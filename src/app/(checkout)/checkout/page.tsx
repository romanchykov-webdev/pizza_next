import { CartItemSkeleton, CheckoutItemDetails, CheckoutItemOrder, Title, WhiteBlock } from "@/components/shared";

import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, PackageIcon, PercentIcon, TruckIcon } from "lucide-react";

export default function CheckoutPage() {
	//

	return (
		<div className={cn("mt-10 pb-40")}>
			<Title text="Оформление заказа" size="xl" className="mb-8" />

			<div className=" grid grid-cols-1 lg:grid-cols-3 gap-10  ">
				{/* left block - top block */}
				<div className="flex flex-col gap-10 flex-1 lg:col-span-2 sm:col-span-2 ">
					<WhiteBlock title="1. Корзина" contentClassName="flex flex-col gap-5">
						<CheckoutItemOrder
							name="Маргарита"
							price={100}
							imageUrl="https://media.dodostatic.net/image/r:233x233/0198bf3d788b78d491891a6da5e94bf1.avif"
							details="20 см традиционное тесто, ингридиенты: Кубики брынзы, Митболы"
							quantity={1}
							// onClickRemove={handleRemove}
							// onClickCountButton={handleCountButton}
							id={1}
						/>

						<CheckoutItemOrder
							name="Маргарита"
							price={100}
							imageUrl="https://media.dodostatic.net/image/r:233x233/0198bf3d788b78d491891a6da5e94bf1.avif"
							details="20 см традиционное тесто. Ингридиенты: Сырный бортик, Сливочная моцарелла, Сыры чеддер и пармезан, Острый перец халапеньо, Нежный цыпленок, Шампиньоны, Ветчина "
							quantity={1}
							// onClickRemove={handleRemove}
							// onClickCountButton={handleCountButton}
							id={2}
						/>
						<CartItemSkeleton />
					</WhiteBlock>

					<WhiteBlock title="2. Персональные данные">
						<div className="grid grid-cols-2 gap-5">
							<Input name="name" className="text-base" placeholder="Имя" />
							<Input name="lastname" className="text-base" placeholder="Фамилия" />
							<Input name="email" className="text-base" placeholder="Email" />
							<Input name="phone" className="text-base" placeholder="Телефон" />
						</div>
					</WhiteBlock>

					{/* adres comment block */}
					<WhiteBlock title="3. Адрес и комментарий">
						<div className="flex flex-col gap-5">
							<Input name="address" className="text-base" placeholder="Адрес" />
							<Textarea rows={5} name="comment" placeholder="Комментарий к заказу" />
						</div>
					</WhiteBlock>
				</div>

				{/* right block - subblock */}
				<div className="flex flex-col gap-10 flex-1 lg:col-span-1 sm:col-span-2 ">
					<WhiteBlock className="p-8 sticky top-4">
						{/* totle price block */}
						<div className="flex flex-col gap-1">
							<span className="text-xl">Итого:</span>
							<span className="text-[34px] font-extrabold">350 zł</span>
						</div>

						{/* delivery price block */}
						<CheckoutItemDetails title="Стоимость товара" value="350" icon={PackageIcon} />
						<CheckoutItemDetails title="Налоги" value="3.5" icon={PercentIcon} />
						<CheckoutItemDetails title="Доставка" value="12" icon={TruckIcon} />

						{/* <span className="text-xl cursor-pointer">У вас есть промокод?</span> */}

						{/* upload block */}
						<Button type="submit" className="w-full h-14 rounded-2xl mt-6 text-base font-bold">
							Перейти к оплате
							<ArrowRightIcon className="w-5 ml-2" />
						</Button>
					</WhiteBlock>
				</div>
			</div>
		</div>
	);
}
