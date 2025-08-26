import React from 'react';
import qs from 'qs';
import { Filters } from '@/hooks/use-filters';
import { useRouter } from 'next/navigation';

export const useQueryFilters = (filters: Filters) => {
  const router = useRouter();

  React.useEffect(() => {
    const params = {
      ...filters.prices,
      pizzaTypes: Array.from(filters.pizzaTypes),
      sizes: Array.from(filters.sizes),
      ingredients: Array.from(filters.selectedIngredients),
    };
    // console.log(filters);
    console.log(
      qs.stringify(filters, {
        arrayFormat: 'comma',
      }),
    );
    const query = qs.stringify(params, {
      arrayFormat: 'comma',
    });

    router.push(`?${query}`, { scroll: false });
  }, [
    filters.prices.priceFrom,
    filters.prices.priceTo,
    filters.pizzaTypes,
    filters.sizes,
    filters.selectedIngredients,
    router,
  ]);
};
