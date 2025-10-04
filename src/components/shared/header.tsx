import { Container } from "@/components/shared/container";
import { SearchInput } from "@/components/shared/search-input";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CartButton } from "./cart-button";

interface IHeaderProps {
	hasSearch?: boolean;
	hasCart?: boolean;
	className?: string;
}

export const Header: React.FC<IHeaderProps> = ({ className, hasSearch = true, hasCart = true }) => {
	const Logo = () => (
		<Link href="/" className="flex items-center gap-3 flex-col md:flex-row">
			<Image src="/logo.png" alt="logo" width={40} height={40} />
			<div className="text-center md:text-left">
				<h1 className="text-xl md:text-2xl uppercase font-black">Next Pizza</h1>
				<p className="text-xs md:text-sm text-gray-400 leading-3">вкусней уже некуда</p>
			</div>
		</Link>
	);

	const AuthButton = () => (
		<Button variant="outline" className="flex items-center gap-1">
			<User size={16} />
			Войти
		</Button>
	);

	const RightSide = () => (
		<div className="flex items-center gap-3 justify-center md:justify-end">
			<AuthButton />
			{hasCart && <CartButton />}
		</div>
	);

	return (
		<header className={cn("border-b", className)}>
			<Container className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4 md:py-8">
				{/* Верхняя часть — логотип и поиск */}
				<div className="flex flex-col md:flex-row md:items-center md:gap-10 w-full">
					<div className="flex justify-center md:justify-start">
						<Logo />
					</div>

					{hasSearch && (
						<div className="mt-4 md:mt-0 md:flex-1">
							<SearchInput />
						</div>
					)}
				</div>

				{/* Правая часть (вход + корзина) */}
				<RightSide />
			</Container>
		</header>
	);
};
