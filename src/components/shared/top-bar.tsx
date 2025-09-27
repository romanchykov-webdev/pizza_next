"use client";
import { Categories } from "@/components/shared/categories";
import { Container } from "@/components/shared/container";
import { SortPopup } from "@/components/shared/sort-popup";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import React, { JSX } from "react";

interface ITopBarProps {
	className?: string;
	categories: Category[];
}

export const TopBar: React.FC<ITopBarProps> = ({ categories, className }): JSX.Element => {
	return (
		<div className={cn("sticky top-0 bg-white py-5 shadow-lg shadow-black/5 z-10", className)}>
			{/* Desktop view - без скролла */}
			<Container className="hidden md:flex items-center justify-between">
				<Categories items={categories} />
				<div className="flex items-center">
					<SortPopup />
				</div>
			</Container>

			{/* Mobile view - с горизонтальным скроллом */}
			<div className="md:hidden overflow-x-auto scrollbar">
				<Container className="flex items-center justify-between px-0 min-w-max">
					<Categories items={categories} />
					<div className="flex items-center ml-4">
						<SortPopup />
					</div>
				</Container>
			</div>
		</div>
	);
};
