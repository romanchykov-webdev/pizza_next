import { CartStateItem } from "@/lib/get-cart-details";
import { useCartStore } from "@/store/cart";
import { useEffect } from "react";
import { CreateCartItemValues } from "../../services/dto/cart.dto";

type CountType = "plus" | "minus";

type ReturnType = {
	totalAmount: number;
	items: CartStateItem[];
	loading: boolean;
	updateItemQuantity: (id: number, quantity: number) => void;
	removeCartItem: (id: number) => void;
	addCartItem: (values: CreateCartItemValues) => void;
	changeItemCount: (id: number, currentQty: number, type: CountType) => void;
};

export const useCart = (): ReturnType => {
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
		fetchCartItems();
	}, [fetchCartItems]);

	const changeItemCount = (id: number, currentQty: number, type: CountType) => {
		const next = type === "plus" ? currentQty + 1 : currentQty - 1;

		if (next < 1) {
			updateItemQuantity(id, 1);
			return;
		}

		updateItemQuantity(id, next);
	};

	return { totalAmount, items, updateItemQuantity, loading, removeCartItem, addCartItem, changeItemCount };
};
