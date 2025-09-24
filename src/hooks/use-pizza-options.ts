import { useEffect, useState } from 'react';
import { PizzaSize, PizzaType } from '@/constants/pizza';
import { Variant } from '@/components/shared/group-variants';

interface ReturnProps {
  size: PizzaSize;
  type: PizzaType;
  setSize: (size: PizzaType) => void;
  setType: (type: PizzaType) => void;
}

export const usePizzaOptions = (availableSizes: Variant[]): ReturnProps => {
  const [size, setSize] = useState<PizzaSize>(20);
  const [type, setType] = useState<PizzaType>(1);

  useEffect(() => {
    const isAvailableSize = availableSizes?.find(
      item => Number(item.value) === size && !item.disabled,
    );
    const availableSize = availableSizes?.find(item => !item.disabled);

    if (!isAvailableSize && availableSize) {
      setSize(Number(availableSize.value) as PizzaSize);
    }
  }, [type]);

  return {
    size,
    type,
    setType,
    setSize,
  };
};
