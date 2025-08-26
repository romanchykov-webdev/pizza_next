'use client';

import React, { JSX } from 'react';
import { cn } from '@/lib/utils';
import { Title } from '@/components/shared/title';
import { Input } from '@/components/ui';
import { RangeSlider } from '@/components/shared/range-slider';
import { CheckboxFiltersGroup } from '@/components/shared/checkbox-filters-group';
import { useFilters, useIngredients, useQueryFilters } from '@/hooks';
import { SlidersHorizontal, Trash2 } from 'lucide-react';

interface IFiltersProps {
  className?: string;
}

export const Filters: React.FC<IFiltersProps> = ({ className }): JSX.Element => {
  const { ingredients, loading } = useIngredients();

  const filters = useFilters();

  useQueryFilters(filters);

  const items = ingredients.map(item => ({ value: String(item.id), text: item.name }));

  const updatePrices = (prices: number[]) => {
    filters.setPrices('priceFrom', prices[0]);
    filters.setPrices('priceTo', prices[1]);
  };
  return (
    <div className={cn('', className)}>
      <div className="flex items-center justify-between  mb-5">
        <Title text="Фильтрация" size="sm" className=" font-bold" />

        {filters.hasFilters && (
          <div className="relative cursor-pointer" onClick={filters.resetFilters}>
            <Trash2 className="text-red-500" />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {/*selected impasto*/}
        <CheckboxFiltersGroup
          title="Тип теста"
          className="mt-5"
          name="impasto"
          items={[
            { text: 'Тонкое', value: '1' },
            { text: 'Традиционное', value: '2' },
          ]}
          onClickCheckbox={filters.setPizzaTypes}
          selected={filters.pizzaTypes}
        />
        {/*selected size*/}
        <CheckboxFiltersGroup
          title="Размеры"
          className="mt-5"
          name="size"
          items={[
            { text: '20 см', value: '20' },
            { text: '30 см', value: '30' },
            { text: '40 см', value: '40' },
          ]}
          onClickCheckbox={filters.setSizes}
          selected={filters.sizes}
        />
      </div>

      {/* Фильтр цен */}
      <div className="mt-5 border-y border-y-neutral-100 py-6 pb-7">
        <p className="font-bold mb-3">Цена от и до:</p>
        <div className="flex gap-3 mb-5">
          {/*<Input*/}
          {/*  type="number"*/}
          {/*  placeholder="0"*/}
          {/*  min={0}*/}
          {/*  max={1000}*/}
          {/*  value={String(filters.prices.priceFrom)}*/}
          {/*  onChange={e => filters.setPrices('priceFrom', Number(e.target.value))}*/}
          {/*/>*/}
          <Input
            type="number"
            placeholder="0"
            min={100}
            max={1000}
            value={String(filters.prices.priceFrom)}
            onChange={e => filters.setPrices('priceFrom', Number(e.target.value))}
          />
          <Input
            type="number"
            placeholder="0"
            min={100}
            max={1000}
            value={String(filters.prices.priceTo)}
            onChange={e => filters.setPrices('priceTo', Number(e.target.value))}
          />
        </div>

        <RangeSlider
          min={0}
          max={1000}
          step={10}
          // value={[0, 5000]}
          value={[filters.prices.priceFrom || 0, filters.prices.priceTo || 1000]}
          onValueChange={updatePrices}
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
        onClickCheckbox={filters.setSelectedIngredients}
        selected={filters.selectedIngredients}
      />
    </div>
  );
};
