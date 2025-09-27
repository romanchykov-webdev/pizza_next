import { CartDTO } from "./dto/cart.dto";
import { axiosInstance } from "./instance";

export const getCart = async (): Promise<CartDTO> => {
	const { data } = await axiosInstance.get<CartDTO>("/cart");

	return data;
};

export const updateItemQuantity = async (itemId: number, quantity: number): Promise<CartDTO> => {
	const { data } = await axiosInstance.patch<CartDTO>("/cart/" + itemId, { quantity });

	return data;
};
