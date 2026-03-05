import './Header.css';

import LogoWhite from '../assets/logo/logo-white.png';
import MobileLogoWhite from '../assets/logo/mobile-logo-white.png';
import CartIcon from '../assets/icons/cart-icon.png';
import { getTotalCartItems } from '@/utils';
import SearchBar from './header/SearchBar';
import { AccountMenu } from './header/AccountMenu';
import { useCart, useUser } from '@/hooks/';
import { NavLink } from 'react-router';

export default function Header() {
	const { cart } = useCart();
	const { user } = useUser();
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
						<AccountMenu user={user} />

						{/* Cart  */}
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
					</>
				) : (
					<NavLink className='nav-link header-link' to='/login'>
						<span className='nav-link-text'>Login</span>
					</NavLink>
				)}
			</div>
		</div>
	);
}
