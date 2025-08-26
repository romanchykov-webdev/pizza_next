'use client';

import React, { JSX } from 'react';
import { cn } from '@/lib/utils';
import { Title } from '@/components/shared/title';
import { Input } from '@/components/ui';
import { RangeSlider } from '@/components/shared/range-slider';
import { CheckboxFiltersGroup } from '@/components/shared/checkbox-filters-group';
import { useFilterIngredients } from '@/hooks/use-filter-ingredients';
import { useSet } from 'react-use';
import qs from 'qs';
import { useRouter, useSearchParams } from 'next/navigation';

interface IRangePriceProps {
  priceFrom?: number;
  priceTo?: number;
}

interface IFiltersProps {
  className?: string;
}

interface IQueryFilters extends IRangePriceProps {
  pizzaTypes: string;
  sizes: string;
  ingredients: string;
}

export const Filters: React.FC<IFiltersProps> = ({ className }): JSX.Element => {
  const searchParams = useSearchParams() as unknown as Map<keyof IQueryFilters, string>;

  const { ingredients, loading, selectedIngredients, onAddId } = useFilterIngredients(
    searchParams.get('ingredients')?.split(','),
  );

  const router = useRouter();

  const [sizes, { toggle: toggleSizes }] = useSet(
    new Set<string>(searchParams.has('sizes') ? searchParams.get('sizes')?.split(',') : []),
  );

  const [pizzaTypes, { toggle: togglePizzaTypes }] = useSet(
    new Set<string>(searchParams.has('sizes') ? searchParams.get('sizes')?.split(',') : []),
  );

  const [prices, setPrice] = React.useState<IRangePriceProps>({
    priceFrom: Number(searchParams.get('priceFrom')) || undefined,
    priceTo: Number(searchParams.get('priceTo')) || undefined,
  });

  const items = ingredients.map(item => ({ value: String(item.id), text: item.name }));

  const updatePrice = (name: keyof IRangePriceProps, value: number) => {
    setPrice({
      ...prices,
      [name]: value,
    });
  };

  React.useEffect(() => {
    const filters = {
      ...prices,
      pizzaTypes: Array.from(pizzaTypes),
      sizes: Array.from(sizes),
      ingredients: Array.from(selectedIngredients),
    };
    // console.log(filters);
    console.log(
      qs.stringify(filters, {
        arrayFormat: 'comma',
      }),
    );
    const query = qs.stringify(filters, {
      arrayFormat: 'comma',
    });

    router.push(`?${query}`, { scroll: false });
  }, [prices, pizzaTypes, sizes, selectedIngredients, router]);

  return (
    <div className={cn('', className)}>
      <Title text="Фильтрация" size="sm" className="mb-5 font-bold" />
      <div className="flex flex-col gap-4">
        {/*selected impasto*/}
        <CheckboxFiltersGroup
          title="Тип теста"
          className="mt-5"
          name="impasto"
          // limit={3}
          // defaultItems={items.slice(0, 6)}
          items={[
            { text: 'Тонкое', value: '1' },
            { text: 'Традиционное', value: '2' },
          ]}
          // loading={loading}
          onClickCheckbox={togglePizzaTypes}
          selected={pizzaTypes}
        />
        {/*selected size*/}
        <CheckboxFiltersGroup
          title="Размеры"
          className="mt-5"
          name="size"
          // limit={3}
          // defaultItems={items.slice(0, 6)}
          items={[
            { text: '20 см', value: '20' },
            { text: '30 см', value: '30' },
            { text: '40 см', value: '40' },
          ]}
          // loading={loading}
          onClickCheckbox={toggleSizes}
          selected={sizes}
        />
      </div>

      {/* Фильтр цен */}
      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Цена от и до:</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={1000}
            // defaultValue={0}
            value={String(prices.priceFrom)}
            // value={String(filters.prices.priceFrom)}
            // onChange={(e) => filters.setPrices('priceFrom', Number(e.target.value))}
            onChange={e => updatePrice('priceFrom', Number(e.target.value))}
          />
          <Input
            type="number"
            placeholder="0"
            min={100}
            max={1000}
            // defaultValue={0}
            value={String(prices.priceTo)}
            // value={String(filters.prices.priceFrom)}
            // onChange={(e) => filters.setPrices('priceFrom', Number(e.target.value))}
            onChange={e => updatePrice('priceTo', Number(e.target.value))}
          />
        </div>

        <RangeSlider
          min={0}
          max={1000}
          step={10}
          // value={[0, 5000]}
          value={[prices.priceFrom || 0, prices.priceTo || 1000]}
          onValueChange={([priceFrom, priceTo]) => setPrice({ priceFrom, priceTo })}
          // value={[filters.prices.priceFrom || 0, filters.prices.priceTo || 1000]}
          // onValueChange={updatePrices}
        />
      </div>
      <CheckboxFiltersGroup
        title="Ингредиенты:"
        className="mt-5"
        name="ingredients"
        limit={3}
        defaultItems={items.slice(0, 6)}
        items={items}
        loading={loading}
        onClickCheckbox={onAddId}
        selected={selectedIngredients}
      />
    </div>
  );
};
