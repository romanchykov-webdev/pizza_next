"use client";

import React, { useEffect, useRef } from "react";
import { useIntersection } from "react-use";

import { cn } from "@/lib/utils";
import { useCategoryStore } from "@/store/category";

import { ProductWithRelations } from "../../../@types/prisma";
import { ProductCard } from "./product-card";
import { Title } from "./title";

interface Props {
	title: string;

	items: ProductWithRelations[];
	categoryId: number;
	className?: string;
}

export const ProductsGroupList: React.FC<Props> = ({ title, items, categoryId, className }) => {
	const setActiveCategoryId = useCategoryStore((state) => state.setActiveId);

	const intersectionRef = useRef<HTMLDivElement>(null);

	const intersection = useIntersection(intersectionRef as React.RefObject<HTMLElement>, {
		threshold: 0.4,
	});

	useEffect(() => {
		if (intersection?.isIntersecting) {
			setActiveCategoryId(categoryId);
			// console.log("categoryId", categoryId);
		}
	}, [categoryId, intersection?.isIntersecting, title, setActiveCategoryId]);

	return (
		<div className={className} id={title} ref={intersectionRef} style={{ scrollMarginTop: "120px" }}>
			<Title text={title} size="lg" className="font-extrabold mb-5" />

			<div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4")}>
				{items
					.filter((product) => product.items.length > 0)
					.map((product) => {
						// console.log("ProductsGroupList", JSON.stringify(product, null));
						// Находим минимальную цену из всех вариантов
						const minPrice = Math.min(...product.items.map((item) => item.price));
						return (
							<ProductCard
								key={product.id}
								id={product.id}
								name={product.name}
								imageUrl={product.imageUrl}
								price={minPrice}
								ingredients={product.ingredients}
							/>
						);
					})}
			</div>
		</div>
	);
};
