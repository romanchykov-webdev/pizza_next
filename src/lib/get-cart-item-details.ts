import { mapPizzaTypes, PizzaSize, PizzaType } from "@/constants/pizza";
import { Ingredient } from "@prisma/client";

export const getCartItemDetails = (pizzaType: PizzaType, pizzaSize: PizzaSize, ingredients: Ingredient[]): string => {
	const details = [];

	if (pizzaSize && pizzaType) {
		// const typeName = type === 1 ? "Традиционное" : "Тонкое";
		const typeName = mapPizzaTypes[pizzaType];

		details.push(`${typeName} ${pizzaSize} см`);
	}

	if (ingredients) {
		details.push(...ingredients.map((ingredient) => ingredient.name));
	}
	return details.join(", ");
};
