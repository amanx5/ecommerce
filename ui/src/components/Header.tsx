import './Header.css';

import LogoWhite from '../assets/logo/logo-white.png';
import MobileLogoWhite from '../assets/logo/mobile-logo-white.png';
import CartIcon from '../assets/icons/cart-icon.png';
import { apiRequest, getTotalCartItems } from '@/utils';
import SearchBar from './header/SearchBar';
import { useCart, useToast, useUser } from '@/hooks/';
import { NavLink, useNavigate } from 'react-router';

export default function Header() {
	const navigate = useNavigate();

	const { cart } = useCart();
	const { setToast } = useToast();
	const { user, setUser } = useUser();
	const totalCartItems = getTotalCartItems(cart);

	return (
		<div className='header'>
			<div className='left-section'>
				<NavLink to='/' className='header-link'>
					<img className='logo' src={LogoWhite} />
					<img className='mobile-logo' src={MobileLogoWhite} />
				</NavLink>
			</div>

			<div className='middle-section'>
				<SearchBar />
			</div>

			<div className='right-section'>
				{user ? (
					<>
						<NavLink className='nav-link header-link' to='/orders'>
							<span className='nav-link-text'>Orders</span>
						</NavLink>

						<NavLink
							className='cart-link header-link'
							to='/checkout'
						>
							<img className='cart-icon' src={CartIcon} />
							<div className='cart-quantity'>
								{totalCartItems}
							</div>
							<div className='cart-text'>Cart</div>
						</NavLink>

						<button
							className='logout-button header-link'
							onClick={onLogoutClick}
						>
							<span className='nav-link-text'>
								Logout ({user.email})
							</span>
						</button>
					</>
				) : (
					<NavLink className='nav-link header-link' to='/login'>
						<span className='nav-link-text'>Login</span>
					</NavLink>
				)}
			</div>
		</div>
	);

	async function onLogoutClick() {
		const response = await apiRequest(
			'/api/auth/signOut',
			{ method: 'post' },
			true,
		);

		if (response.status === 204) {
			navigate('/login', { replace: true });
			setUser(null);
		} else {
			setToast({
				message:
					response.data?.message ||
					'Failed to sign out. Please try again.',
				type: 'error',
			});
		}
	}
}
