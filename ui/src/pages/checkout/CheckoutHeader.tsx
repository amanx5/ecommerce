import './CheckoutHeader.css';
import { NavLink } from 'react-router';
import StorefrontIcon from "@mui/icons-material/Storefront";
import CheckoutLock from '@/assets/icons/checkout-lock-icon.png'
import { useCheckoutContext } from '@/hooks/useCheckoutContext';
import { getTotalCartItems } from '@/utils';

export default function CheckoutHeader() {
	const { cart } = useCheckoutContext();
	const totalCartItems = getTotalCartItems(cart);

	return (
		<div className="checkout-header">
			<div className='header-content'>
				<div className='checkout-header-left-section'>
					<NavLink
						to='/'
						className='header-link'
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '8px',
							color: 'var(--header-bg)',
							textDecoration: 'none',
						}}
					>
						<StorefrontIcon style={{ fontSize: 32 }} />
						<span
							className='site-name'
							style={{
								fontSize: '28px',
								fontWeight: 700,
								letterSpacing: '2px',
								fontFamily: '"Dancing Script", cursive',
							}}
						>
							SHOP
						</span>
					</NavLink>
				</div>

				<div className='checkout-header-middle-section'>
					<span>Checkout</span> 
					<NavLink className='return-to-home-link' to='/'>
						{`(${totalCartItems} items)`} 
					</NavLink>
				</div>

				<div className='checkout-header-right-section'>
					<img src={CheckoutLock} />
				</div>
			</div>
		</div>
	);
}
