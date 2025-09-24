'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import { Button } from '../ui/button';
import { Title } from './title';
import { ProductImage } from '@/components/shared/product-image';
import { GroupVariants } from '@/components/shared/group-variants';
import { PizzaSize, PizzaType, pizzaTypes } from '@/constants/pizza';
import { IngredientsList } from '@/components/shared/Ingredients-list';
import { IProduct } from '../../../@types/prisma';
import { getPizzaDetails } from '@/lib';
import { usePizzaOptions } from '@/hooks/use-pizza-options';
import { Ingredient, ProductItem } from '@prisma/client';

interface Props {
  imageUrl: string;
  name: string;
  className?: string;
  ingredients: Ingredient[];
  items?: ProductItem[];
  onClickAdd?: VoidFunction;
}

export const ChoosePizzaForm: React.FC<Props> = ({
  name,
  items = [],
  imageUrl,
  ingredients,
  onClickAdd,
  className,
}) => {
  const { size, type, selectedIngredients, availableSizes, setType, setSize, addIngredient } =
    usePizzaOptions(items);

  const { textDetails, totalPrice } = getPizzaDetails(
    type,
    size,
    items,
    ingredients,
    selectedIngredients,
  );

  const handleClickAdd = async () => {
    onClickAdd?.();
    console.log({ size, type, ingredients, selectedIngredients });
    // try {
    //   await addPizza();
    //   onClickAdd?.();
    // } catch (error) {
    //   toast.error('Произошла ошибка при добавлении в корзину');
    //   console.error(error);
    // }
  };

  return (
    <div className={cn(className, 'flex flex-1 ')}>
      <ProductImage imageUrl={imageUrl} size={size} className="w-[400px]" />

      <div className="w-[490px] bg-[#FCFCFC] p-7">
        <Title text={name} size="md" className="font-extrabold mb-1" />

        <p className="text-gray-400">{textDetails}</p>

        <div className=" flex flex-col ga-4 mt-5">
          <GroupVariants
            items={availableSizes}
            selectedValue={String(size)}
            onClick={value => setSize(Number(value) as PizzaSize)}
            className="mb-5"
          />
          <GroupVariants
            items={pizzaTypes}
            selectedValue={String(type)}
            onClick={value => setType(Number(value) as PizzaType)}
            className="mb-5"
          />
        </div>

        <div className="bg-gray-50 p-5 rounded-md h-[420px] overflow-auto scrollbar  mb-3">
          <IngredientsList
            ingredients={ingredients}
            onClickAdd={addIngredient}
            selectedIds={selectedIngredients}
          />
        </div>

        <Button
          loading={false}
          onClick={handleClickAdd}
          className="h-[55px] px-10 text-base rounded-[18px] w-full"
        >
          Добавить в корзину за {totalPrice} ₽
        </Button>
      </div>
    </div>
  );
};
