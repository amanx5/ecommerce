import './RegisterPage.css';
import { useState, FormEvent } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { MinimalHeader } from '@/components/MinimalHeader';
import { apiRequest } from '@/utils';
import { useUser } from '@/hooks/useUser';
import type { User } from '@/types';
import { verifyLogin } from '@/utils/account';

export default function RegisterPage() {
	const navigate = useNavigate();
	const { setUser } = useUser();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);

		const resp = await apiRequest<User>('/api/auth/register', {
			method: 'post',
			data: { email, password },
		});

		if (resp.success && resp.data) {
			const userData = await verifyLogin();

			if (userData) {
				setUser(userData);
				navigate('/', { replace: true });
			} else {
				setMessage(
					'Registration successful. Before logging in, please enable third-party cookies to continue. Or open the app in a Guest window.'
				);
			};
		} else {
			setError(resp.message || 'Unable to register');
		}
	};

	return (
		<>
			<link rel='icon' type='image/png' href='favicon/register.png' />
			<title>Register - Shop</title>
			<MinimalHeader/>
			<div className='register-page'>
				<form className='register-form' onSubmit={onSubmit}>
					<h2>Create account</h2>
					{error && <div className='error'>{error}</div>}
					{message && <div className='message'>{message}</div>}
					<label>
						Email
						<input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</label>
					<label>
						Password
						<input
							type='password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</label>
					<button type='submit'>Register</button>
					<p>
						Already have an account?{' '}
						<NavLink to='/login'>Login</NavLink>
					</p>
				</form>
			</div>
		</>
	);
}
