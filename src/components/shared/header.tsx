import { Container } from "@/components/shared/container";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { JSX } from "react";
import { CartButton } from "./cart-button";

interface IHeaderProps {
	className?: string;
}

export const Header: React.FC<IHeaderProps> = ({ className }): JSX.Element => {
	return (
		<header className={cn("border border-b", className)}>
			<Container className="flex items-center justify-between py-8">
				{/*  left block*/}
				<Link href="/">
					<div className="flex items-center gap-4">
						<Image src="/logo.png" alt="logo" width={35} height={35} />

						<div>
							<h1 className="text-2xl uppercase font-black">Next Pizza</h1>
							<p className="text-sm text-gray-400 leading-3">вкусней уже некуда</p>
						</div>
					</div>
				</Link>

				{/*search*/}
				<div className=" mx-10 flex-1">
					<SearchInput />
				</div>

				{/* Правая часть */}
				<div className="flex items-center gap-3">
					<Button variant="outline" className="flex items-center gap-1">
						<User size={16} />
						Войти
					</Button>

					<CartButton />
				</div>
			</Container>
		</header>
	);
};
