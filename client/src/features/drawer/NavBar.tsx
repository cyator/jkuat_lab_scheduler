import React from 'react';
import clsx from 'clsx';
import {
	alpha,
	makeStyles,
	Theme,
	createStyles,
} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { open, drawerState } from './drawerSlice';

import AccountMenu from '../../components/AccountMenu';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
		},
		grow: {
			flexGrow: 1,
		},
		appBar: {
			zIndex: theme.zIndex.drawer + 1,
			transition: theme.transitions.create(['width', 'margin'], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
		},
		appBarShift: {
			marginLeft: drawerWidth,
			width: `calc(100% - ${drawerWidth}px)`,
			transition: theme.transitions.create(['width', 'margin'], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
		},
		menuButton: {
			marginRight: 36,
		},
		hide: {
			display: 'none',
		},
		search: {
			position: 'relative',
			borderRadius: theme.shape.borderRadius,
			backgroundColor: alpha(theme.palette.common.white, 0.15),
			'&:hover': {
				backgroundColor: alpha(theme.palette.common.white, 0.25),
			},
			marginRight: theme.spacing(2),
			marginLeft: 0,
			width: '100%',
			[theme.breakpoints.up('sm')]: {
				marginLeft: theme.spacing(3),
				width: 'auto',
			},
		},
		searchIcon: {
			padding: theme.spacing(0, 2),
			height: '100%',
			position: 'absolute',
			pointerEvents: 'none',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		inputRoot: {
			color: 'inherit',
		},
		inputInput: {
			padding: theme.spacing(1, 1, 1, 0),
			// vertical padding + font size from searchIcon
			paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
			transition: theme.transitions.create('width'),
			width: '100%',
			[theme.breakpoints.up('md')]: {
				width: '20ch',
			},
		},
	})
);

export default function NavBar() {
	const classes = useStyles();
	const dispatch = useAppDispatch();
	const { isOpen } = useAppSelector(drawerState);

	return (
		<div className={classes.root}>
			<AppBar
				position="fixed"
				className={clsx(classes.appBar, {
					[classes.appBarShift]: isOpen,
				})}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={() => dispatch(open())}
						edge="start"
						className={clsx(classes.menuButton, {
							[classes.hide]: isOpen,
						})}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap>
						JKUAT LABS
					</Typography>

					<div className={classes.search}>
						<div className={classes.searchIcon}>
							<SearchIcon />
						</div>
						<InputBase
							placeholder="Search…"
							classes={{
								root: classes.inputRoot,
								input: classes.inputInput,
							}}
							inputProps={{ 'aria-label': 'search' }}
						/>
					</div>
					<div className={classes.grow} />
					<AccountMenu />
				</Toolbar>
			</AppBar>
		</div>
	);
}
