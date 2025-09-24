

import { Container, Filters, ProductsGroupList, Title, TopBar } from '@/components/shared';
import { Suspense } from 'react';
import { prisma } from '../../../prisma/prisma-client';

export default async function Home() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        include: {
          ingredients: true,
          items: true,
        },
      },
    },
  });
  console.log('categories', categories);
  return (
    <>
      <Container className="mt-10">
        <Title text="Все пиццы" size="lg" className="font-extrabold" />
      </Container>
      {/*<TopBar categories={categories} />*/}
      <TopBar categories={categories.filter(c => c.products.length > 0)} />

      <Container className="mt-10 pb-16">
        <div className="flex gap-[80px]">
          {/* Фильтрация */}
          <div className="w-[250px]">
            <Suspense fallback={<div>Загрузка фильтров...</div>}>
              <Filters />
            </Suspense>
          </div>

          {/* Список товаров */}
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              {categories.map(
                category =>
                  category.products.length > 0 && (
                    <div id={`category-${category.id}`} key={category.id}>
                      <ProductsGroupList
                        categoryId={category.id}
                        title={category.name}
                        items={category.products}
                      />
                    </div>
                  ),
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
