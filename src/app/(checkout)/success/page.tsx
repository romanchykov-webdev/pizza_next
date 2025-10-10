"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

// Функция для получения значения куки
// function getCookie(name: string): string | undefined {
// 	const value = `; ${document.cookie}`;
// 	const parts = value.split(`; ${name}=`);
// 	if (parts.length === 2) return parts.pop()?.split(";").shift();
// 	return undefined;
// }

const SuccessContent = () => {
	const params = useSearchParams();
	const router = useRouter();
	const sessionId = params.get("session_id");
	const [secondsLeft, setSecondsLeft] = useState(5);
	const shownOnceRef = useRef(false);

	useEffect(() => {
		if (sessionId) {
			if (!shownOnceRef.current) {
				toast.success("✅ Оплата прошла успешно!");
				shownOnceRef.current = true;
			}

			const tick = setInterval(() => {
				setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
			}, 1000);

			const toHome = setTimeout(() => {
				router.replace("/");
			}, 5000);

			return () => {
				clearInterval(tick);
				clearTimeout(toHome);
			};
		} else {
			const toHome = setTimeout(() => router.replace("/"), 3000);
			return () => clearTimeout(toHome);
		}
	}, [sessionId, router]);

	return (
		<div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
			<h1 className="text-3xl font-bold mb-4">Спасибо за заказ 🎉</h1>
			<p className="text-lg text-neutral-600 mb-4">
				Ваша оплата прошла успешно. Мы уже начинаем готовить ваш заказ!
			</p>

			{sessionId ? (
				<p className="text-sm text-neutral-500">Сейчас перенаправим на главную через {secondsLeft} сек…</p>
			) : (
				<p className="text-sm text-neutral-500">Сейчас вернём на главную…</p>
			)}

			<button
				onClick={() => router.replace("/")}
				className="mt-6 inline-flex items-center rounded-md bg-black px-4 py-2 text-white"
			>
				На главную
			</button>
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
