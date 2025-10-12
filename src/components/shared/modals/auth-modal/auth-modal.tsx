"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import React, { useState } from "react";

import { LoginForm } from "./forms/login-form";
import { RegisterForm } from "./forms/register-form";

import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { signIn } from "next-auth/react";

interface Props {
	open: boolean;
	onClose: () => void;
}

export const AuthModal: React.FC<Props> = ({ open, onClose }) => {
	const [type, setType] = useState<"login" | "register">("login");

	const onSwitchType = () => {
		setType(type === "login" ? "register" : "login");
	};

	const handleClose = () => {
		onClose();
		setType("login");
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="max-w-[450px] bg-white p-10 rounded-lg shadow-md shadow-yellow-500">
				<VisuallyHidden>
					<DialogTitle>{"dialog title"}</DialogTitle>
				</VisuallyHidden>

				{/* Формы */}
				{type === "login" ? <LoginForm onClose={handleClose} /> : <RegisterForm onClose={handleClose} />}

				<hr />

				{/* Кнопки */}
				<div className="flex gap-2">
					<Button
						variant="secondary"
						onClick={() =>
							signIn("github", {
								callbackUrl: "/",
								redirect: true,
							})
						}
						type="button"
						className="gap-2 h-12 p-2 flex-1"
					>
						<img
							className="w-6 h-6"
							src="https://github.githubassets.com/favicons/favicon.svg"
							alt="Authentication image"
						/>
						GitHub
					</Button>

					<Button
						variant="secondary"
						onClick={() =>
							signIn("google", {
								callbackUrl: "/",
								redirect: true,
							})
						}
						type="button"
						className="gap-2 h-12 p-2 flex-1"
					>
						<img
							className="w-6 h-6"
							src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
							alt="Authentication image"
						/>
						Google
					</Button>
				</div>

				<Button variant="outline" onClick={onSwitchType} type="button" className="h-12">
					{type !== "login" ? "Войти" : "Регистрация"}
				</Button>
			</DialogContent>
		</Dialog>
	);
};
