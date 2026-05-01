import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import Header from '@/components/Header';
import { renderWithContext } from '@/test/renderWithContext';
import { createUsernameFromEmail } from '@/utils/account';

describe('Header link visibility based on auth status', () => {
	it('shows login when no user is present', () => {
		const user = null;
		renderWithContext(<Header />, { userContext: { user } });
		expect(screen.getByText(/login/i)).toBeInTheDocument();
		expect(screen.queryByText(/orders/i)).not.toBeInTheDocument();
	});

	it('shows user name and cart when user exists', () => {
		const user = { id: 'u1', email: 'a@b.com' };
		renderWithContext(<Header />, { userContext: { user } });
		expect(
			screen.getByText(createUsernameFromEmail(user.email)),
		).toBeInTheDocument();
		expect(screen.getByText(/cart/i)).toBeInTheDocument();
		expect(screen.queryByText(/login/i)).not.toBeInTheDocument();
	});
});
