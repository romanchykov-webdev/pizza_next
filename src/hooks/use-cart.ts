import { CartStateItem } from "@/lib/get-cart-details";
import { useCartStore } from "@/store/cart";
// import { useEffect } from "react";
import { useEffect, useRef } from "react";
import { CreateCartItemValues } from "../../services/dto/cart.dto";

type CountType = "plus" | "minus";

// type ReturnType = {
// 	totalAmount: number;
// 	items: CartStateItem[];
// 	loading: boolean;
// 	updateItemQuantity: (id: number, quantity: number) => void;
// 	removeCartItem: (id: number) => void;
// 	addCartItem: (values: CreateCartItemValues) => void;
// 	changeItemCount: (id: number, currentQty: number, type: CountType) => void;
// };
type UseCartReturn = {
	totalAmount: number;
	items: CartStateItem[];
	loading: boolean;
	updateItemQuantity: (id: number, quantity: number) => void;
	removeCartItem: (id: number) => void;
	addCartItem: (values: CreateCartItemValues) => void;
	changeItemCount: (id: number, currentQty: number, type: CountType) => void;
};
export const useCart = (): UseCartReturn => {
	//
	const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
	const pendingQtyRef = useRef<Map<number, number>>(new Map());
	const DEBOUNCE_MS = 300;
	//
	const totalAmount = useCartStore((state) => state.totalAmount);

	const fetchCartItems = useCartStore((state) => state.fetchCartItems);

	const items = useCartStore((state) => state.items);

	const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);

	const loading = useCartStore((state) => state.loading);

	const removeCartItem = useCartStore((state) => state.removeCartItem);

	const addCartItem = useCartStore((state) => state.addCartItem);
	//

	useEffect(() => {
		const timers = timersRef.current;
		const pendings = pendingQtyRef.current;

		return () => {
			for (const t of timers.values()) clearTimeout(t);
			timers.clear();
			pendings.clear();
		};
	}, []);

	useEffect(() => {
		fetchCartItems();
	}, [fetchCartItems]);

	// const changeItemCount = (id: number, currentQty: number, type: CountType) => {
	// 	const next = type === "plus" ? currentQty + 1 : currentQty - 1;

	// 	if (next < 1) {
	// 		updateItemQuantity(id, 1);
	// 		return;
	// 	}

	// 	updateItemQuantity(id, next);
	// };
	const changeItemCount = (id: number, currentQty: number, type: CountType) => {
		// базой берём "ожидаемое" значение, если уже есть серия кликов; иначе текущее из стора
		const base = pendingQtyRef.current.get(id) ?? currentQty;
		const next = type === "plus" ? base + 1 : base - 1;

		// не даём уйти ниже 1
		const clamped = Math.max(1, next);

		// сохранить ожидаемое значение
		pendingQtyRef.current.set(id, clamped);

		// перезапустить таймер для этого товара
		const prev = timersRef.current.get(id);
		if (prev) clearTimeout(prev);

		const timer = setTimeout(() => {
			const finalQty = pendingQtyRef.current.get(id) ?? 1;
			updateItemQuantity(id, finalQty);

			// очистка
			pendingQtyRef.current.delete(id);
			timersRef.current.delete(id);
		}, DEBOUNCE_MS);

		timersRef.current.set(id, timer);
	};

	return { totalAmount, items, updateItemQuantity, loading, removeCartItem, addCartItem, changeItemCount };
};
