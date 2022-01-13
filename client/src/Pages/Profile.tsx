import React, { useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import StudentsIcon from '@material-ui/icons/SchoolOutlined';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
	fetchUser,
	clearError,
	profileState,
} from '../features/profile/profileSlice';
import { authState } from '../features/auth/authSlice';

import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%',
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

function Profile() {
	const classes = useStyles();
	const { error, profile } = useAppSelector(profileState);
	const { user } = useAppSelector(authState);
	const dispatch = useAppDispatch();

	const { id, first_name, last_name } = profile;

	useEffect(() => {
		const { id } = user;
		dispatch(fetchUser(id));
	}, [dispatch, user]);

	useEffect(() => {
		if (error.status) {
			console.log(error);
			toast.error(error.message);
			dispatch(clearError());
		}
	}, [error, dispatch]);

	return (
		<Container component="main" maxWidth="xs">
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<StudentsIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Profile
				</Typography>
				<form className={classes.form} noValidate>
					<TextField
						disabled
						variant="outlined"
						margin="normal"
						fullWidth
						label="First Name"
						value={first_name}
					/>
					<TextField
						disabled
						variant="outlined"
						margin="normal"
						fullWidth
						label="Last Name"
						value={last_name}
					/>
					<TextField
						disabled
						variant="outlined"
						margin="normal"
						fullWidth
						label={
							user.role === 'student' ||
							user.role === 'classrep' ||
							user.role === 'groupLeader'
								? 'Registration Number'
								: 'Staff Number'
						}
						value={id}
					/>
				</form>
			</div>
		</Container>
	);
}

export default Profile;
