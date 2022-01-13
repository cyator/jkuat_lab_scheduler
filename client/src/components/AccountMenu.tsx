import React, { MouseEvent, useState } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { useHistory } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { logout } from '../features/auth/authSlice';

function AccountMenu() {
	const dispatch = useAppDispatch();
	const history = useHistory();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleMenu = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleProfile = () => {
		history.push('/profile');
		handleClose();
	};

	const handleLogout = () => {
		dispatch(logout());
	};

	return (
		<div>
			<IconButton
				aria-label="account of current user"
				aria-controls="menu-appbar"
				aria-haspopup="true"
				onClick={handleMenu}
				color="inherit"
			>
				<AccountCircle />
			</IconButton>
			<Menu
				id="menu-appbar"
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				keepMounted
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
				open={open}
				onClose={handleClose}
			>
				<MenuItem onClick={handleProfile}>Profile</MenuItem>
				<MenuItem onClick={handleLogout}>Log Out</MenuItem>
			</Menu>
		</div>
	);
}

export default AccountMenu;
