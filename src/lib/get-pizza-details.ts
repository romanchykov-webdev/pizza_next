import { Ingredient, ProductItem } from '@prisma/client';
import { calcTotalPizzaPrice } from '@/lib/calc-total-pizza-price';
import { mapPizzaTypes, PizzaSize, PizzaType } from '@/constants/pizza';

export const getPizzaDetails = (
  type: PizzaType,
  size: PizzaSize,
  items: ProductItem[] = [],
  ingredients: Ingredient[],
  selectedIngredientsIds: Set<number>,
) => {
  const totalPrice = calcTotalPizzaPrice(type, size, items, ingredients, selectedIngredientsIds);

  const textDetails = `${size} см ${mapPizzaTypes[type]} пицца`;

  return { totalPrice, textDetails };
};
