import { prisma } from "../../prisma/prisma-client";

export interface GetSearchParams {
	query?: string;
	sortBy?: string;
	sizes?: string;
	pizzaTypes?: string;
	ingredients?: string;
	priceFrom?: string;
	priceTo?: string;
	// limit?: string;
	// page?: string;
}

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000;

// const DEFAULT_LIMIT = 12;
// const DEFAULT_PAGE = 1;

export const findPizzas = async (params: GetSearchParams) => {
	//

	// console.log("priceFilter", priceFilter);
	const size = params.sizes?.split(",").map(Number);

	const pizzaType = params.pizzaTypes?.split(",").map(Number);

	const ingredientsIdArr = params.ingredients?.split(",").map(Number);

	// Обработка фильтров цены
	const minPrice = Number(params.priceFrom) || DEFAULT_MIN_PRICE;
	const maxPrice = Number(params.priceTo) || DEFAULT_MAX_PRICE;

	let priceFilter = {};
	if (Number.isFinite(minPrice)) priceFilter = { ...priceFilter, gte: minPrice };
	if (Number.isFinite(maxPrice)) priceFilter = { ...priceFilter, lte: maxPrice };

	// //

	// // Создаем базовый запрос для фильтрации товаров
	// const whereCondition: any = {};

	// // Добавляем фильтр по ингредиентам, если они выбраны
	// if (ingredientsIdArr && ingredientsIdArr.length > 0) {
	// 	whereCondition.ingredients = {
	// 		some: {
	// 			id: {
	// 				in: ingredientsIdArr,
	// 			},
	// 		},
	// 	};
	// }

	// // Создаем условие для фильтрации по размеру и типу пиццы
	// const itemsCondition: any = {};

	// // Добавляем фильтр по цене всегда, независимо от других фильтров
	// if (Object.keys(priceFilter).length > 0) {
	// 	itemsCondition.price = priceFilter;
	// }

	// // Добавляем фильтр по размеру и типу пиццы только если они выбраны
	// if (size && size.length > 0) {
	// 	itemsCondition.size = { in: size };
	// }

	// if (pizzaType && pizzaType.length > 0) {
	// 	itemsCondition.pizzaType = { in: pizzaType };
	// }

	// // Добавляем условие для items только если есть хотя бы один фильтр
	// if (Object.keys(itemsCondition).length > 0) {
	// 	whereCondition.items = {
	// 		some: itemsCondition,
	// 	};
	// }

	//

	const categories = await prisma.category.findMany({
		include: {
			products: {
				orderBy: {
					id: "desc",
				},
				// where: {
				// 	ingredients: ingredientsIdArr
				// 		? {
				// 				some: {
				// 					id: {
				// 						in: ingredientsIdArr,
				// 					},
				// 				},
				// 			}
				// 		: undefined,
				// 	items: {
				// 		some: {
				// 			...(size && size.length > 0 ? { size: { in: size } } : {}),
				// 			...(pizzaType && pizzaType.length > 0 ? { pizzaType: { in: pizzaType } } : {}),
				// 			...(Object.keys(priceFilter).length > 0 ? { price: priceFilter } : {}),
				// 		},
				// 	},
				// },
				// where: whereCondition,
				where: {
					// Фильтрация по ингредиентам, если они выбраны
					...(ingredientsIdArr && ingredientsIdArr.length > 0
						? {
								ingredients: {
									some: {
										id: {
											in: ingredientsIdArr,
										},
									},
								},
							}
						: {}),

					// Важно: для фильтрации по цене используем some, чтобы найти продукты,
					// у которых есть хотя бы один item в указанном диапазоне цен
					items: {
						some: {
							// Фильтр по цене всегда применяется
							price: {
								gte: minPrice,
								lte: maxPrice,
							},
							// Дополнительные фильтры по размеру и типу пиццы
							...(size && size.length > 0 ? { size: { in: size } } : {}),
							...(pizzaType && pizzaType.length > 0 ? { pizzaType: { in: pizzaType } } : {}),
						},
					},
				},
				include: {
					ingredients: true,
					items: true,
				},
			},
		},
	});

	return categories;
	//
};
