import { Ingredient } from '@prisma/client';
import React from 'react';
import { Api } from '../../services/api-client';
import { useSet } from 'react-use';

type IngredientItem = Pick<Ingredient, 'id' | 'name'>;

interface ReturnProps {
  ingredients: IngredientItem[];
  loading: boolean;
  selectedIngredients: Set<string>;
  onAddId: (id: string) => void;
}

export const useFilterIngredients = (values: string[] = []): ReturnProps => {
  const [ingredients, setIngredients] = React.useState<ReturnProps['ingredients']>([]);

  const [loading, setLoading] = React.useState<boolean>(true);

  const [selectedIds, { toggle }] = useSet(new Set<string>(values));

  React.useEffect(() => {
    async function fetchIngredients() {
      try {
        setLoading(true);
        const ingredients = await Api.ingredients.getAll();
        setIngredients(
          ingredients.map(ingredient => ({ id: ingredient.id, name: ingredient.name })),
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchIngredients();
  }, []);

  return { ingredients, loading, onAddId: toggle, selectedIngredients: selectedIds };
};
