import type { User } from '@/types';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import OrdersIcon from '@/assets/icons/orders.svg';
import LogoutIcon from '@/assets/icons/logout.svg';
import { Fragment, useState } from 'react';
import { apiRequest } from '@/utils';
import { useNavigate } from 'react-router';
import { useToast, useUser } from '@/hooks';

export function AccountMenu({ user }: { user: User }) {
	const navigate = useNavigate();
	const { setToast } = useToast();
	const { setUser } = useUser();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const userName = user.email.split('@')[0];
	const userNamePascalCase =
		userName.at(0)?.toUpperCase() + userName.slice(1);

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<Fragment>
			{/* account  */}
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					textAlign: 'center',
				}}
			>
				<Tooltip title='Your Account'>
					<IconButton
						onClick={handleClick}
						size='small'
						sx={{ ml: 2, color: 'white' }}
						aria-controls={open ? 'account-menu' : undefined}
						aria-haspopup='true'
						aria-expanded={open ? 'true' : undefined}
					>
						<AccountCircleIcon sx={{ width: 36, height: 36 }} />
						<span className='nav-link-text account-text'>
							{userNamePascalCase}
						</span>
					</IconButton>
				</Tooltip>
			</Box>

			{/* account menu */}
			<Menu
				anchorEl={anchorEl}
				id='account-menu'
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				slotProps={{
					paper: {
						elevation: 0,
						sx: {
							overflow: 'visible',
							filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							mt: 1.5,
							'& .MuiAvatar-root': {
								width: 32,
								height: 32,
								ml: -0.5,
								mr: 1,
							},
							'&::before': {
								content: '""',
								display: 'block',
								position: 'absolute',
								top: 0,
								right: 14,
								width: 10,
								height: 10,
								bgcolor: 'background.paper',
								transform: 'translateY(-50%) rotate(45deg)',
								zIndex: 0,
							},
						},
					},
				}}
				disableScrollLock={true}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
			>
				{/* Orders */}
				<MenuItem
					onClick={() => {
						handleClose();
						onOrdersClick();
					}}
				>
					<ListItemIcon>
						<img src={OrdersIcon} />
					</ListItemIcon>
					Orders
				</MenuItem>

				{/* logout */}
				<MenuItem
					onClick={() => {
						handleClose();
						onLogoutClick();
					}}
				>
					<ListItemIcon>
						<img src={LogoutIcon} />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
		</Fragment>
	);

	async function onOrdersClick() {
		navigate('/orders');
	}

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
