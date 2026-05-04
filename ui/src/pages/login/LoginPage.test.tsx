import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import LoginPage from './LoginPage';
import { screen } from '@testing-library/react';
import { renderWithContext } from '@/test/renderWithContext';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import type { User } from '@/types';
import * as userHooks from '@/hooks/useUser';
import { API_ENDPOINTS } from '@/utils';

const dummyUser: User = { id: 'u1', email: 'test@example.com' };

describe('LoginPage', () => {
	const setUser = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		vi.spyOn(userHooks, 'useSetUser').mockReturnValue(setUser);
		renderWithContext(<LoginPage />);
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

		// mock for API_ENDPOINTS.auth.signIn.POST endpoint
		(axios.post as Mock).mockResolvedValue({
			data: { success: true, data: dummyUser },
		});
		// mock for API_ENDPOINTS.auth.user.GET endpoint - verifyLogin uses this
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
			expect(axios.post).toHaveBeenCalledWith(API_ENDPOINTS.auth.signIn.POST, {
				email,
				password,
			});
			// setUser should get called with returned user
			expect(setUser).toHaveBeenCalledWith(dummyUser);
		});
	});
});
