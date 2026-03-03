import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from './Header';
import { AppContext } from '@/context/AppContext';
import { MemoryRouter } from 'react-router';
import type { User } from '@/types';

const dummyUser = { id: 'u1', email: 'a@b.com' };

function renderWithContext(user: User | null) {
	render(
		<AppContext.Provider
			value={{
				cart: [],
				toast: null,
				user,
				setCart: () => {},
				setToast: () => {},
				setUser: () => {},
			}}
		>
			<MemoryRouter>
				<Header />
			</MemoryRouter>
		</AppContext.Provider>,
	);
}

describe('Header link visibility based on auth status', () => {
	it('shows login when no user is present', () => {
		renderWithContext(null);
		expect(screen.getByText(/login/i)).toBeInTheDocument();
		expect(screen.queryByText(/orders/i)).not.toBeInTheDocument();
	});

	it('shows orders and cart when user exists', () => {
		renderWithContext(dummyUser);
		expect(screen.getByText(/orders/i)).toBeInTheDocument();
		expect(screen.getByText(/cart/i)).toBeInTheDocument();
		expect(screen.queryByText(/login/i)).not.toBeInTheDocument();
	});
});
