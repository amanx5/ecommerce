import './RegisterPage.css';
import { useState, FormEvent } from 'react';
import { NavLink, useNavigate } from 'react-router';
import Header from '@/components/Header';
import { apiRequest } from '@/utils';
import { useUser } from '@/hooks/useUser';
import type { User } from '@/types';

export default function RegisterPage() {
	const navigate = useNavigate();
	const { setUser } = useUser();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setError(null);

		const resp = await apiRequest<User>('/api/auth/register', {
			method: 'post',
			data: { email, password },
		});

		if (resp.success && resp.data) {
			// after registering we can sign user in
			setUser(resp.data);
			navigate('/', { replace: true });
		} else {
			setError(resp.message || 'Unable to register');
		}
	};

	return (
		<>
			<link rel='icon' type='image/png' href='favicon/register.png' />
			<title>Register - Ecommerce</title>
			<Header />
			<div className='register-page'>
				<form className='register-form' onSubmit={onSubmit}>
					<h2>Create account</h2>
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
