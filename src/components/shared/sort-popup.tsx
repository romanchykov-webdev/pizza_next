import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";
import React, { JSX } from "react";

interface ISortPopupProps {
	className?: string;
}

export const SortPopup: React.FC<ISortPopupProps> = ({ className }): JSX.Element => {
	return (
		<div
			className={cn(
				"inline-flex items-center gap-1 bg-gray-50 px-5 h-[52px] rounded-2xl cursor-pointer md:text-sm",
				className,
			)}
		>
			<ArrowUpDown size={16} />
			<b>Сортировка:</b>
			<b className="text-primary">популярное</b>
		</div>
	);
};
