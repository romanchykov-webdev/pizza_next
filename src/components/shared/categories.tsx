'use client';
import React, { JSX } from 'react';
import { cn } from '@/lib/utils';
import { useCategoryStore } from '@/store/category';

interface ICategoriesProps {
  className?: string;
}

// const cats = ['Пиццы', 'Комбо', 'Закуски', 'Коктейли', 'Кофе', 'Напитки', 'Десерты', 'Десерты'];
const cats = [
  { id: 1, name: 'Пиццы' },
  { id: 2, name: 'Комбо' },
  { id: 3, name: 'Закуски' },
  { id: 4, name: 'Коктейли' },
  { id: 5, name: 'Кофе' },
  { id: 6, name: 'Напитки' },
  { id: 7, name: 'Десерты' },
  { id: 8, name: 'Десерты' },
];

export const Categories: React.FC<ICategoriesProps> = ({ className }): JSX.Element => {
  const categoryActiveId = useCategoryStore(state => state.activeId);

  return (
    <div className={cn('inline-flex gap-1 bg-gray-50 p-1 rounded-2xl', className)}>
      {cats.map(({ name, id }, index) => (
        <a
          href={`/#${name}`}
          key={id}
          className={cn(
            'flex items-center font-bold h-11 rounded-2xl px-5 transition-all duration-600',
            categoryActiveId === id &&
              'bg-white shadow-md shadow-gray-200 text-primary text-[#FE5F00]',
          )}
        >
          <button className="cursor-pointer">{name}</button>
        </a>
      ))}
    </div>
  );
};
