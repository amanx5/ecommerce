import { createContext, Dispatch, SetStateAction } from 'react';
import { ToastData, CartItemExpanded, User } from '@/types';

export type Cart = CartItemExpanded[];
export type SetCart = Dispatch<SetStateAction<CartItemExpanded[]>>;
export type Toast = ToastData | null;
export type SetToast = Dispatch<SetStateAction<ToastData | null>>;
export type SetUser = Dispatch<SetStateAction<User | null>>;

export interface AppContextType {
	cart: Cart;
	toast: Toast;
	user: User | null;
	setCart: SetCart;
	setToast: SetToast;
	setUser: SetUser;
}

export const AppContext = createContext<AppContextType | null>(null);
