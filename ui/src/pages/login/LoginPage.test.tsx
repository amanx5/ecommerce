import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import LoginPage from './LoginPage';
import { render, screen } from '@testing-library/react';
import { AppContext } from '@/context/AppContext';
import { MemoryRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import type { User } from '@/types';

const dummyUser: User = { id: 'u1', email: 'test@example.com' };

describe('LoginPage', () => {
	const setUser = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		render(
			<AppContext.Provider
				value={{
					cart: [],
					toast: null,
					user: null,
					setCart: () => {},
					setToast: () => {},
					setUser,
				}}
			>
				<MemoryRouter>
					<LoginPage />
				</MemoryRouter>
			</AppContext.Provider>,
		);
	});

	it('renders form inputs', () => {
		expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
		expect(
			screen.getByRole('button', { name: /login/i }),
		).toBeInTheDocument();
	});

	it('submits credentials and updates user on success', async () => {
		const user = userEvent.setup();
		const emailInput = screen.getByLabelText(/Email/i);
		const pwdInput = screen.getByLabelText(/Password/i);
		const submit = screen.getByRole('button', { name: /login/i });

		// mock for /api/auth/signIn endpoint
		(axios.post as Mock).mockResolvedValue({
			data: { success: true, data: dummyUser },
		});
		// mock for /api/auth/user endpoint - verifyLogin uses this
		(axios.get as Mock).mockResolvedValue({
			data: { success: true, data: dummyUser },
		});

		const email = 'foo@bar.com';
		const password = 'secret';

		await user.clear(emailInput);
		await user.clear(pwdInput);
		await user.type(emailInput, email);
		await user.type(pwdInput, password);
		await user.click(submit);

		await vi.waitFor(() => {
			expect(axios.post).toHaveBeenCalledWith('/api/auth/signIn', {
				email,
				password,
			});
			// setUser should get called with returned user
			expect(setUser).toHaveBeenCalledWith(dummyUser);
		});
	});
});
