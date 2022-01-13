import React from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import {
	createStyles,
	makeStyles,
	useTheme,
	Theme,
} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import StudentsIcon from '@material-ui/icons/SchoolOutlined';
import EquipmentIcon from '@material-ui/icons/ListAltOutlined';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import PracticalsIcon from '@material-ui/icons/BuildOutlined';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { close, drawerState } from './drawerSlice';
import { authState } from '../auth/authSlice';

import NavBar from './NavBar';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
		},
		drawer: {
			width: drawerWidth,
			flexShrink: 0,
			whiteSpace: 'nowrap',
		},
		drawerOpen: {
			width: drawerWidth,
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
		},
		drawerClose: {
			transition: theme.transitions.create('width', {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
			overflowX: 'hidden',
			width: theme.spacing(7) + 1,
			[theme.breakpoints.up('sm')]: {
				width: theme.spacing(9) + 1,
			},
		},
		toolbar: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'flex-end',
			padding: theme.spacing(0, 1),
			// necessary for content to be below app bar
			...theme.mixins.toolbar,
		},
		content: {
			flexGrow: 1,
			padding: theme.spacing(3),
		},
		tabs: {
			borderRight: `1px solid ${theme.palette.divider}`,
		},
	})
);

export default function AppDrawer() {
	const classes = useStyles();
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const { isOpen } = useAppSelector(drawerState);
	const { user } = useAppSelector(authState);
	const history = useHistory();

	const itemList =
		user.role === 'lecturer' || user.role === 'cod'
			? [
					{
						text: 'Home',
						icon: <HomeIcon />,
						onClick: () => history.push('/'),
					},
					{
						text: 'Marks',
						icon: <EquipmentIcon />,
						onClick: () => history.push('/marks'),
					},
					{
						text: 'Practicals',
						icon: <PracticalsIcon />,
						onClick: () => history.push('/practicals'),
					},
					{
						text: 'Students',
						icon: <StudentsIcon />,
						onClick: () => history.push('/students'),
					},
			  ]
			: user.role === 'groupLeader'
			? [
					{
						text: 'Home',
						icon: <HomeIcon />,
						onClick: () => history.push('/'),
					},
					{
						text: 'Reports',
						icon: <EquipmentIcon />,
						onClick: () => history.push('/reports'),
					},
					{
						text: 'Practicals',
						icon: <PracticalsIcon />,
						onClick: () => history.push('/practicals'),
					},
			  ]
			: user.role === 'classrep'
			? [
					{
						text: 'Home',
						icon: <HomeIcon />,
						onClick: () => history.push('/'),
					},
					{
						text: 'Practicals',
						icon: <PracticalsIcon />,
						onClick: () => history.push('/practicals'),
					},
					{
						text: 'Students',
						icon: <StudentsIcon />,
						onClick: () => history.push('/students'),
					},
			  ]
			: user.role === 'student'
			? [
					{
						text: 'Home',
						icon: <HomeIcon />,
						onClick: () => history.push('/'),
					},

					{
						text: 'Practicals',
						icon: <PracticalsIcon />,
						onClick: () => history.push('/practicals'),
					},
			  ]
			: [
					{
						text: 'Home',
						icon: <HomeIcon />,
						onClick: () => history.push('/'),
					},
					{
						text: 'Equipment',
						icon: <EquipmentIcon />,
						onClick: () => history.push('/equipment'),
					},
					{
						text: 'Practicals',
						icon: <PracticalsIcon />,
						onClick: () => history.push('/practicals'),
					},
					{
						text: 'Students',
						icon: <StudentsIcon />,
						onClick: () => history.push('/students'),
					},
			  ];

	const userItemList = [
		{
			text: 'Settings',
			icon: <SettingsIcon />,
			onClick: () => history.push('settings'),
		},
	];

	return (
		<div className={classes.root}>
			<NavBar />
			<Drawer
				variant="permanent"
				className={clsx(classes.drawer, {
					[classes.drawerOpen]: isOpen,
					[classes.drawerClose]: !isOpen,
				})}
				classes={{
					paper: clsx({
						[classes.drawerOpen]: isOpen,
						[classes.drawerClose]: !isOpen,
					}),
				}}
			>
				<div className={classes.toolbar}>
					<IconButton onClick={() => dispatch(close())}>
						{theme.direction === 'rtl' ? (
							<ChevronRightIcon />
						) : (
							<ChevronLeftIcon />
						)}
					</IconButton>
				</div>
				<Divider />
				<List>
					{itemList.map(({ text, icon, onClick }) => (
						<ListItem button key={text} onClick={onClick}>
							<ListItemIcon>{icon}</ListItemIcon>
							<ListItemText primary={text} />
						</ListItem>
					))}
				</List>

				<Divider />
				<List>
					{userItemList.map(({ text, icon, onClick }) => (
						<ListItem button key={text} onClick={onClick}>
							<ListItemIcon>{icon}</ListItemIcon>
							<ListItemText primary={text} />
						</ListItem>
					))}
				</List>
			</Drawer>
		</div>
	);
}
