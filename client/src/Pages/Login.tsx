import React, { useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
	attemptLogin,
	authState,
	clearError,
} from '../features/auth/authSlice';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

function Copyright() {
	return (
		<Typography variant="body2" color="textSecondary" align="center">
			{'Copyright © '}
			<Link color="inherit" href="https://labs@jkuat.ac.ke/">
				jkuat labs
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}

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

export type FormData = {
	email: string;
	password: string;
};

const schema = yup.object().shape({
	email: yup
		.string()
		.trim()
		.lowercase()
		.required()
		.matches(
			/^[a-z]+.[a-z]+.@(students|staff).jkuat.ac.ke$/,
			'please use a valid jkuat email'
		),
	password: yup.string().trim().min(8).max(30).required(),
});

export default function LogIn() {
	const dispatch = useAppDispatch();
	const { isAuthenticated, error } = useAppSelector(authState);
	const history = useHistory();
	const classes = useStyles();
	const { control, handleSubmit } = useForm<FormData>({
		resolver: yupResolver(schema),
	});
	const onSubmit = handleSubmit((data) => {
		console.log(data);
		dispatch(attemptLogin(data));
	});

	useEffect(() => {
		if (error.status) {
			console.log(error);
			toast.error(error.message);
			dispatch(clearError());
		}
		if (isAuthenticated) {
			history.push('/');
		}
	}, [isAuthenticated, history, error, dispatch]);

	return (
		<Container component="main" maxWidth="xs">
			<div className={classes.paper}>
				<Box p={1}>
					<Typography variant="h4">JKUAT LABS</Typography>
				</Box>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>
				<form onSubmit={onSubmit} className={classes.form} noValidate>
					<Controller
						name="email"
						control={control}
						render={({ field: { ref, ...rest }, fieldState: { error } }) => (
							<TextField
								{...rest}
								innerRef={ref}
								variant="outlined"
								margin="normal"
								required
								fullWidth
								id="email"
								label="Email Address"
								autoComplete="email"
								autoFocus
								error={error ? true : false}
								helperText={error?.message ?? `please type in your email`}
							/>
						)}
					/>
					<Controller
						name="password"
						control={control}
						render={({ field: { ref, ...rest }, fieldState: { error } }) => (
							<TextField
								{...rest}
								innerRef={ref}
								variant="outlined"
								margin="normal"
								required
								fullWidth
								label="Password"
								type="password"
								id="password"
								autoComplete="current-password"
								error={error ? true : false}
								helperText={error?.message ?? `please type in your password`}
							/>
						)}
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						Sign In
					</Button>
					<Grid container>
						<Grid item xs>
							<Link href="#" variant="body2">
								Forgot password?
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
			<Box mt={8}>
				<Copyright />
			</Box>
		</Container>
	);
}
