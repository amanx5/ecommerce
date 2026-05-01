import { UserContext, UserContextType } from '@/context/UserContext';
import { ToastContext, ToastContextType } from '@/context/ToastContext';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';

type ExtendedRenderOptions = {
	renderOptions?: RenderOptions;
	route?: string;
	toastContext?: Partial<ToastContextType>;
	userContext?: Partial<UserContextType>;
};

export function renderWithContext(
	ui: ReactElement,
	extendedRenderOptions?: ExtendedRenderOptions,
) {
	const {
		route = '/',
		renderOptions,
		userContext,
		toastContext,
	} = extendedRenderOptions || {};

	const mockUserContext = {
		user: userContext?.user ?? null,
		cart: userContext?.cart ?? [],
		setUser: userContext?.setUser ?? vi.fn(),
		setCart: userContext?.setCart ?? vi.fn(),
	};

	const mockToastContext = {
		toast: toastContext?.toast ?? null,
		setToast: toastContext?.setToast ?? vi.fn(),
	};

	return {
		...render(
			<ToastContext.Provider value={mockToastContext}>
				<UserContext.Provider value={mockUserContext}>
					<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
				</UserContext.Provider>
			</ToastContext.Provider>,
			renderOptions,
		),
		mockUserContext,
		mockToastContext,
	};
}
