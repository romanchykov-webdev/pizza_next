import { Container, FilterDrawer, Filters, ProductsGroupList, Title, TopBar } from "@/components/shared";
import { Suspense } from "react";
// import { prisma } from "../../../prisma/prisma-client";
import { findPizzas } from "@/lib";
import { GetSearchParams } from "@/lib/find-pizza";

const toStr = (v?: string | string[]) => (typeof v === "string" ? v : Array.isArray(v) ? v[0] : undefined);

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[]>> }) {
	// Дожидаемся разрешения промиса searchParams
	const raw = await searchParams;

	// Нормализуем в строки, используя интерфейс GetSearchParams
	const sp: GetSearchParams = {
		query: toStr(raw.query),
		sortBy: toStr(raw.sortBy),
		sizes: toStr(raw.sizes),
		pizzaTypes: toStr(raw.pizzaTypes),
		ingredients: toStr(raw.ingredients),
		priceFrom: toStr(raw.priceFrom),
		priceTo: toStr(raw.priceTo),
	};

	const categories = await findPizzas(sp);

	console.log({ categories });
	//
	return (
		<>
			<Container className="mt-10 flex items-center justify-between">
				<Title text="Все пиццы" size="lg" className="font-extrabold" />
				{/* <FilterDrawer /> */}
				<Suspense fallback={<div>Загрузка фильтров...</div>}>
					<FilterDrawer />
				</Suspense>
			</Container>
			{/*<TopBar categories={categories} />*/}
			{/* <TopBar categories={categories.filter((c) => c.products.length > 0)} /> */}
			<Suspense fallback={<div>Загрузка категорий...</div>}>
				<TopBar categories={categories.filter((c) => c.products.length > 0)} />
			</Suspense>

			<Container className="mt-10 pb-16">
				<div className="flex gap-[80px]">
					{/* Фильтрация на десктопах */}
					<div className="w-[250px] hidden lg:block">
						<Suspense fallback={<div>Загрузка фильтров...</div>}>
							<Filters />
						</Suspense>
					</div>

					{/* Список товаров */}
					<div className="flex-1">
						<div className="flex flex-col gap-16">
							{categories.map(
								(category) =>
									category.products.length > 0 && (
										<div id={`category-${category.id}`} key={category.id}>
											<ProductsGroupList
												categoryId={category.id}
												title={category.name}
												items={category.products}
											/>
										</div>
									),
							)}
						</div>
					</div>
				</div>
			</Container>
		</>
	);
}
