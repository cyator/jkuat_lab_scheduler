import React, { useEffect } from 'react';
import { Avatar, Button, Typography, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import StudentsIcon from '@material-ui/icons/SchoolOutlined';
import { useForm } from 'react-hook-form';
import Input from './Input';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
	clearError,
	createGroup,
	groupState,
} from '../../../features/groups/groupsSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
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

export type FormData = {
	group_name: string;
};

const schema = yup.object().shape({
	group_name: yup.string().trim().min(2).max(50).required(),
});

export default function AddGroup() {
	const classes = useStyles();
	const { control, handleSubmit } = useForm<FormData>({
		resolver: yupResolver(schema),
	});
	const { error } = useAppSelector(groupState);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (error.status) {
			console.log(error);
			toast.error(error.message);
			dispatch(clearError());
		}
	}, [error, dispatch]);

	const onSubmit = handleSubmit((data) => dispatch(createGroup(data)));

	return (
		<Container maxWidth="xs">
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<StudentsIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Create Group
				</Typography>
				<form onSubmit={onSubmit} className={classes.form} noValidate>
					<Input name="group_name" control={control} />
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						Submit
					</Button>
				</form>
			</div>
		</Container>
	);
}
