"use client";

import React, { useEffect, useRef } from "react";
import { useIntersection } from "react-use";

import { cn } from "@/lib/utils";
import { useCategoryStore } from "@/store/category";
import { ProductCard } from "./product-card";
import { Title } from "./title";

interface Props {
	title: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	items: any[];
	// items: ProductWithRelations[];
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
			console.log("categoryId", categoryId);
		}
	}, [categoryId, intersection?.isIntersecting, title, setActiveCategoryId]);

	return (
		<div className={className} id={title} ref={intersectionRef} style={{ scrollMarginTop: "120px" }}>
			<Title text={title} size="lg" className="font-extrabold mb-5" />

			<div className={cn("grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4")}>
				{items
					.filter((product) => product.items.length > 0)
					.map((product) => (
						<ProductCard
							key={product.id}
							id={product.id}
							name={product.name}
							imageUrl={product.imageUrl}
							price={product.items[0].price}
						/>
					))}
			</div>
		</div>
	);
};
