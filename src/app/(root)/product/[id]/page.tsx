import React from 'react';
import { prisma } from '../../../../../prisma/prisma-client';
import { notFound } from 'next/navigation';
import { Container, GroupVariants, ProductImage, Title } from '@/components/shared';

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findFirst({
    where: {
      id: Number(id),
    },
    include: {
      ingredients: true,
      category: {
        include: {
          products: {
            include: {
              items: true,
            },
          },
        },
      },
      items: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          product: {
            include: {
              items: true,
            },
          },
        },
      },
    },
  });

  if (!product) {
    return notFound();
  }

  return (
    <Container className="flex flex-col my-30 ">
      <div className="flex flex-1">
        <ProductImage imageUrl={product.imageUrl} alt={product.name} size={20} />

        <div className="w-[490px] bg-[#f7f6f5] p-7">
          <Title text={product.name} size="md" className="font-extrabold mb-1" />
          <p className="text-gray-400">Lorem ipsum dolor sit amet, consectetur adipisicing elit</p>
          <GroupVariants
            items={[
              {
                name: 'Маленькая',
                value: '1',
              },
              {
                name: 'Средняя',
                value: '2',
              },
              {
                name: 'Большая',
                value: '3',
                disabled: true,
              },
            ]}
            selectedValue="1"
          />
        </div>
      </div>
    </Container>
  );
}
