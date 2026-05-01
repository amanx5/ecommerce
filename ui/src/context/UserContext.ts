import { createContext, Dispatch, SetStateAction } from 'react';
import { CartItemExpanded, User } from '@/types';

export type Cart = CartItemExpanded[];
export type SetCart = Dispatch<SetStateAction<CartItemExpanded[]>>;
export type SetUser = Dispatch<SetStateAction<User | null>>;

export interface UserContextType {
	cart: Cart;
	user: User | null;
	setCart: SetCart;
	setUser: SetUser;
}

export const UserContext = createContext<UserContextType | null>(null);
