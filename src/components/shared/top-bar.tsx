'use client';
import React, { JSX } from 'react';
import { cn } from '@/lib/utils';
import { Categories } from '@/components/shared/categories';
import { SortPopup } from '@/components/shared/sort-popup';
import { Container } from '@/components/shared/container';
import { Category } from '@prisma/client';

interface ITopBarProps {
  className?: string;
  categories: Category[];
}

export const TopBar: React.FC<ITopBarProps> = ({ categories, className }): JSX.Element => {
  const [cartVisible, setCartVisible] = React.useState(false);

  // React.useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 300) {
  //       setCartVisible(true);
  //     } else {
  //       setCartVisible(false);
  //     }
  //   };
  //
  //   window.addEventListener('scroll', handleScroll);
  //
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);

  return (
    <div className={cn('sticky top-0 bg-white py-5 shadow-lg shadow-black/5 z-10', className)}>
      <Container className="flex items-center justify-between ">
        <Categories items={categories} />
        <div className="flex items-center">
          <SortPopup />
        </div>
      </Container>
    </div>
  );
};
