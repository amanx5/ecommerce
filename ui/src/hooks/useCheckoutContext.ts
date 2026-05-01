import { useContext } from 'react';
import { CheckoutContext, type CheckoutContextType } from '@/context/CheckoutContext';

export function useCheckoutContext(): CheckoutContextType {
	const context = useContext(CheckoutContext);
	if (!context) {
		throw new Error('useCheckoutContext must be used within an CheckoutContext.Provider');
	}

	return context;
}