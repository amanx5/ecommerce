import { createContext, Dispatch, SetStateAction } from 'react';
import { PaymentSummaryData } from '@/types';
import type { Cart } from '@/hooks/useCart';

export type SetPaymentSummary = Dispatch<SetStateAction<PaymentSummaryData | null>>;

export interface CheckoutContextType {
	cart: Cart;
	paymentSummary: PaymentSummaryData | null;
	setPaymentSummary: SetPaymentSummary;
}

export const CheckoutContext = createContext<CheckoutContextType | null>(null);