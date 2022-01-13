import React, { useEffect } from 'react';
import { Avatar, Button, Typography, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import PracticalsIcon from '@material-ui/icons/BuildOutlined';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FileInput from './FileInput';
import Input from './Input';
import MultilineInput from './MultilineInput';
import {
	addPractical,
	practicalState,
	clearError,
} from '../../../features/practicals/practicalSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { authState } from '../../../features/auth/authSlice';
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
	unit_code: string;
	prac_name: string;
	abstract: string;
	lab_manual: FileList;
};

const schema = yup.object().shape({
	unit_code: yup
		.string()
		.trim()
		.required()
		.uppercase()
		.matches(/^TIE[0-9]{3}$/, 'please use a valid unit code'),
	prac_name: yup.string().trim().min(2).max(50).required(),
	abstract: yup.string().trim().min(2).max(500).required(),
	lab_manual: yup
		.mixed()
		.required()
		.test(
			'type',
			'we only support pdf',
			(value) => value && value[0].type === 'application/pdf'
		)
		.test(
			'fileSize',
			'File Size is too large',
			(value) => value && value[0].size <= 5 * 1024 * 1024
		),
});

export default function AddPractical() {
	const classes = useStyles();
	const dispatch = useAppDispatch();
	const { user } = useAppSelector(authState);
	const { error } = useAppSelector(practicalState);
	const { control, handleSubmit } = useForm<FormData>({
		resolver: yupResolver(schema),
	});
	const onSubmit: SubmitHandler<FormData> = (data, e) =>
		dispatch(addPractical({ labtech_id: user.id, ...data }));
	const onError = (errors: any, e: any) => console.log(errors, e);

	useEffect(() => {
		if (error.status) {
			console.log(error);
			toast.error(error.message);
			dispatch(clearError());
		}
	}, [error, dispatch]);

	return (
		<Container maxWidth="xs">
			<div className={classes.paper}>
				<Avatar className={classes.avatar}>
					<PracticalsIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Add Practical
				</Typography>
				<form
					onSubmit={handleSubmit(onSubmit, onError)}
					className={classes.form}
					noValidate
				>
					<Input name="unit_code" control={control} />
					<Input name="prac_name" control={control} />
					<MultilineInput name="abstract" control={control} />
					<FileInput name="lab_manual" control={control} />
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
