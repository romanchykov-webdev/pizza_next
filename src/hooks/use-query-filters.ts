import { Filters } from "@/hooks/use-filters";
import { useRouter } from "next/navigation";
import qs from "qs";
import { useEffect, useRef } from "react";

export const useQueryFilters = (filters: Filters) => {
	const router = useRouter();

	const prevQueryRef = useRef<string>("");

	useEffect(() => {
		const params = {
			...filters.prices,
			pizzaTypes: Array.from(filters.pizzaTypes),
			sizes: Array.from(filters.sizes),
			ingredients: Array.from(filters.selectedIngredients),
		};

		const query = qs.stringify(params, {
			arrayFormat: "comma",
		});

		// Проверяем, изменился ли запрос
		if (query !== prevQueryRef.current && typeof window !== "undefined") {
			prevQueryRef.current = query;

			// Сравниваем с текущим URL, чтобы избежать ненужных обновлений
			const currentQuery = window.location.search.replace("?", "");
			if (query !== currentQuery) {
				router.push(`?${query}`, { scroll: false });
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		filters.prices.priceFrom,
		filters.prices.priceTo,
		filters.pizzaTypes,
		filters.sizes,
		filters.selectedIngredients,
		router,
	]);
	// useEffect(() => {
	// 	const params = {
	// 		...filters.prices,
	// 		pizzaTypes: Array.from(filters.pizzaTypes),
	// 		sizes: Array.from(filters.sizes),
	// 		ingredients: Array.from(filters.selectedIngredients),
	// 	};
	// 	// console.log(filters);
	// 	// console.log(
	// 	//   qs.stringify(filters, {
	// 	//     arrayFormat: 'comma',
	// 	//   }),
	// 	// );
	// 	const query = qs.stringify(params, {
	// 		arrayFormat: "comma",
	// 	});

	// 	router.push(`?${query}`, { scroll: false });
	// }, [filters, router]);
	//  [
	// 	filters.prices.priceFrom,
	// 	filters.prices.priceTo,
	// 	filters.pizzaTypes,
	// 	filters.sizes,
	// 	filters.selectedIngredients,
	// 	router,
	// ]);
};
