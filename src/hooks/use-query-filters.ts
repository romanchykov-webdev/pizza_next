import { Filters } from "@/hooks/use-filters";
import { useRouter } from "next/navigation";
import qs from "qs";
import { useEffect } from "react";

export const useQueryFilters = (filters: Filters) => {
	const router = useRouter();

	useEffect(() => {
		const params = {
			...filters.prices,
			pizzaTypes: Array.from(filters.pizzaTypes),
			sizes: Array.from(filters.sizes),
			ingredients: Array.from(filters.selectedIngredients),
		};
		// console.log(filters);
		// console.log(
		//   qs.stringify(filters, {
		//     arrayFormat: 'comma',
		//   }),
		// );
		const query = qs.stringify(params, {
			arrayFormat: "comma",
		});

		router.push(`?${query}`, { scroll: false });
	}, [filters, router]);
	//  [
	// 	filters.prices.priceFrom,
	// 	filters.prices.priceTo,
	// 	filters.pizzaTypes,
	// 	filters.sizes,
	// 	filters.selectedIngredients,
	// 	router,
	// ]);
};
