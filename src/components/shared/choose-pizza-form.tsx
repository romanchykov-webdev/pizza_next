'use client';

import { cn } from '@/lib/utils';
import React from 'react';
import { Button } from '../ui/button';
import { Title } from './title';
import { useSet } from 'react-use';
import toast from 'react-hot-toast';
import { ProductImage } from '@/components/shared/product-image';
import { GroupVariants } from '@/components/shared/group-variants';
import { mapPizzaTypes, PizzaSize, pizzaSize, PizzaType, pizzaTypes } from '@/constants/pizza';
import { IngredientsList } from '@/components/shared/Ingredients-list';
import { IProduct } from '../../../@types/prisma';

interface Props {
  imageUrl: string;
  name: string;
  className?: string;
  ingredients: IProduct['ingredients'];
  items?: IProduct['items'];
  onClickAdd?: VoidFunction;
}

export const ChoosePizzaForm: React.FC<Props> = ({
  name,
  items,
  imageUrl,
  ingredients,
  onClickAdd,
  className,
}) => {
  const [size, setSize] = React.useState<PizzaSize>(20);
  const [type, setType] = React.useState<PizzaType>(1);

  const [selectedIngredientsIds, { toggle: toggleAddIngredient }] = useSet(new Set<number>([]));

  const pizzaPrice = items?.find(item => item.pizzaType === type && item.size === size)?.price || 0;

  const totalIngredientsPrice = ingredients
    .filter(ingredient => selectedIngredientsIds.has(ingredient.id))
    .reduce((acc, val) => {
      return acc + val.price;
    }, 0);

  const handleClickAdd = async () => {
    onClickAdd?.();
    console.log({ size, type, ingredients: selectedIngredientsIds });

    // try {
    //   await addPizza();
    //   onClickAdd?.();
    // } catch (error) {
    //   toast.error('Произошла ошибка при добавлении в корзину');
    //   console.error(error);
    // }
  };

  const textDetails = `${size} см ${mapPizzaTypes[type]} пицца`;
  const totalPrice = pizzaPrice + totalIngredientsPrice;

  const availablePizzas = items?.filter(item => Number(item.pizzaType) === type);
  const availablePizzaSize = pizzaSize.map(item => ({
    name: item.name,
    value: item.value,
    disabled: !availablePizzas?.some(pizza => Number(pizza.size) === Number(item.value)),
  }));
  console.log(items, availablePizzaSize);
  React.useEffect(() => {
    const isAvailableSize = availablePizzaSize?.find(
      item => Number(item.value) === size && !item.disabled,
    );
    const availableSize = availablePizzaSize?.find(item => !item.disabled);

    if (!isAvailableSize && availableSize) {
      setSize(Number(availableSize.value) as PizzaSize);
    }
  }, [type]);

  return (
    <div className={cn(className, 'flex flex-1 ')}>
      <ProductImage
        imageUrl={imageUrl}
        // size={size}
        size={size}
        className="w-[400px]"
      />

      <div className="w-[490px] bg-[#FCFCFC] p-7">
        <Title text={name} size="md" className="font-extrabold mb-1" />

        <p className="text-gray-400">{textDetails}</p>

        <div className=" flex flex-col ga-4 mt-5">
          <GroupVariants
            items={availablePizzaSize}
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
            onClickAdd={toggleAddIngredient}
            selectedIds={selectedIngredientsIds}
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
