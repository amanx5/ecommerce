import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
	ToastSetterContext,
	type ToastSetterContextType,
} from '@/context/ToastSetterContext';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';
import type { User } from '@/types';
import type { Cart } from '@/hooks/useCart';

type ExtendedRenderOptions = {
	renderOptions?: RenderOptions;
	route?: string;
	toastSetterContext?: ToastSetterContextType;
	user?: User | null;
	cart?: Cart;
};

export function renderWithContext(
	ui: ReactElement,
	extendedRenderOptions?: ExtendedRenderOptions,
) {
	const {
		route = '/',
		renderOptions,
		toastSetterContext = vi.fn(),
		user = null,
		cart = [],
	} = extendedRenderOptions || {};

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	// Seed the TanStack Query cache with user and cart data
	queryClient.setQueryData(['user'], user);
	if (user) {
		queryClient.setQueryData(['cart', user.id], cart);
	}

	return {
		...render(
			<QueryClientProvider client={queryClient}>
				<ToastSetterContext.Provider value={toastSetterContext}>
					<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
				</ToastSetterContext.Provider>
			</QueryClientProvider>,
			renderOptions,
		),
		queryClient,
		toastSetterContext,
	};
}
