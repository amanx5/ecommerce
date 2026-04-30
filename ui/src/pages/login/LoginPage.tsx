import './LoginPage.css';
import { useState, FormEvent } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { MinimalHeader } from '@/components/MinimalHeader';
import { apiRequest } from '@/utils';
import { useUser } from '@/hooks/useUser';
import type { User } from '@/types';
import { verifyLogin } from '@/utils/account';

export default function LoginPage() {
	const navigate = useNavigate();
	const { setUser } = useUser();
	const [email, setEmail] = useState('user@abc.com');
	const [password, setPassword] = useState('password');
	const [error, setError] = useState<string | null>(null);

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);

		const resp = await apiRequest<User>('/api/auth/signIn', {
			method: 'post',
			data: { email, password },
		});

		if (resp.success && resp.data) {
      const userData = await verifyLogin();

      if (userData) {
        setUser(userData);
				navigate('/', { replace: true });
			} else {
				setError(
					'Login failed. Please enable third-party cookies to continue. Or open the app in a Guest window.'
				);
			}
		} else {
			setError(resp.message || 'Unable to sign in');
		}
	};

	return (
		<>
			<link rel='icon' type='image/png' href='favicon/login.png' />
			<title>Login - Shop</title>
			<MinimalHeader/>
			<div className='login-page'>
				<form className='login-form' onSubmit={onSubmit}>
					<h2>Login</h2>
					{error && <div className='error'>{error}</div>}
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
					<button type='submit'>Login</button>
					<p>
						{"Don't have an account? "}
						<NavLink to='/register'>Register</NavLink>
					</p>
				</form>
			</div>
		</>
	);
}
