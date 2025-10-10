"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import toast from "react-hot-toast";

// Функция для получения значения куки
function getCookie(name: string): string | undefined {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop()?.split(";").shift();
	return undefined;
}

const SuccessContent = () => {
	const params = useSearchParams();
	const router = useRouter();
	const sessionId = params.get("session_id");

	useEffect(() => {
		if (sessionId) {
			toast.success("✅ Оплата прошла успешно!");

			// Получаем cartToken из куки
			const cookieCartToken = getCookie("cartToken");
			console.log("Cookie cartToken:", cookieCartToken);
		} else {
			// Если нет sessionId, перенаправляем на главную через 5 секунд
			const timeout = setTimeout(() => {
				router.replace("/");
			}, 5000);
			return () => clearTimeout(timeout);
		}
	}, [sessionId, router]);

	return (
		<div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
			<h1 className="text-3xl font-bold mb-4">Спасибо за заказ 🎉</h1>
			<p className="text-lg text-neutral-600">Ваша оплата прошла успешно. Мы уже начинаем готовить ваш заказ!</p>
		</div>
	);
};

export default function CheckoutSuccessPage() {
	return (
		<Suspense fallback={<div className="flex min-h-[70vh] items-center justify-center">Загрузка…</div>}>
			<SuccessContent />
		</Suspense>
	);
}
