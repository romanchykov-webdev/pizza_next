// import { Filters } from "@/hooks/use-filters";
// import { useRouter } from "next/navigation";
// import qs from "qs";
// import { useEffect, useRef } from "react";

// export const useQueryFilters = (filters: Filters) => {
// 	const router = useRouter();

// 	const prevQueryRef = useRef<string>("");

// 	useEffect(() => {
// 		const params = {
// 			...filters.prices,
// 			pizzaTypes: Array.from(filters.pizzaTypes),
// 			sizes: Array.from(filters.sizes),
// 			ingredients: Array.from(filters.selectedIngredients),
// 		};

// 		const query = qs.stringify(params, {
// 			arrayFormat: "comma",
// 		});

// 		// Проверяем, изменился ли запрос
// 		if (query !== prevQueryRef.current && typeof window !== "undefined") {
// 			prevQueryRef.current = query;

// 			// Сравниваем с текущим URL, чтобы избежать ненужных обновлений
// 			const currentQuery = window.location.search.replace("?", "");
// 			if (query !== currentQuery) {
// 				router.push(`?${query}`, { scroll: false });
// 			}
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [
// 		filters.prices.priceFrom,
// 		filters.prices.priceTo,
// 		filters.pizzaTypes,
// 		filters.sizes,
// 		filters.selectedIngredients,
// 		router,
// 	]);
// };
import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Filters } from "@/hooks/use-filters";
import { useFilterUtils } from "./use-filter-utils";

export function useQueryFilters(filters: Filters, ) {
	const router = useRouter();
	const pathname = usePathname();

	// вытаскиваем утилиты «одним хуком»
	const { useDebouncedValue, useSkipFirstRender, serializeFiltersToQuery, pickHistoryMode } = useFilterUtils();

	const skipFirst = useSkipFirstRender();
	const prevFiltersRef = React.useRef<Filters | null>(null);
	const lastAppliedRef = React.useRef<string>("");

	// канонические параметры
	const params = React.useMemo(
		() => ({
			priceFrom: filters.prices.priceFrom,
			priceTo: filters.prices.priceTo,
			pizzaTypes: Array.from(filters.pizzaTypes),
			sizes: Array.from(filters.sizes),
			ingredients: Array.from(filters.selectedIngredients),
		}),
		[filters],
	);

	// дебаунсим весь фильтр
	const debouncedParams = useDebouncedValue(params, 500);

	// генерим query
	const query = React.useMemo(
		() => serializeFiltersToQuery(debouncedParams),
		[debouncedParams, serializeFiltersToQuery],
	);

	React.useEffect(() => {
		if (skipFirst()) {
			prevFiltersRef.current = filters;
			if (typeof window !== "undefined") {
				lastAppliedRef.current = window.location.search;
			}
			return;
		}

		const prev = prevFiltersRef.current ?? filters;
		const mode = pickHistoryMode(filters, prev);

		if (typeof window === "undefined") return;
		const current = window.location.search;

		if (current !== query && lastAppliedRef.current !== query) {
			router[mode](`${pathname}${query}`, { scroll: false });
			lastAppliedRef.current = query;
		}

		prevFiltersRef.current = filters;
	}, [query, pathname, router, filters, skipFirst, pickHistoryMode]);
}