import React, { useEffect } from 'react';
import { Avatar, Button, Typography, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useForm, SubmitHandler, Controller, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FileInput from '../reports/FileInput';
import {
	practicalState,
	clearError,
} from '../../../features/practicals/practicalSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { toast } from 'react-toastify';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import EquipmentIcon from '@material-ui/icons/ListAltOutlined';
import { Unit } from '../../../features/units/unitsSlice';
import { Practical } from '../../../features/practicals/practicalSlice';
import { addReport } from '../../../features/reports/reportsSlice';

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
	report: FileList;
};

const schema = yup.object().shape({
	unit_code: yup.string().required(),
	prac_name: yup.string().required(),
	report: yup
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

interface Props {
	units: Unit[];
	practicals: Practical[];
}

export default function AddPractical({ units, practicals }: Props) {
	const classes = useStyles();
	const dispatch = useAppDispatch();
	const { error } = useAppSelector(practicalState);
	const { control, handleSubmit } = useForm<FormData>({
		resolver: yupResolver(schema),
	});
	const unitCode = useWatch({
		control,
		name: 'unit_code',
	});
	const onSubmit: SubmitHandler<FormData> = (data, e) => {
		dispatch(addReport(data));
	};

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
					<EquipmentIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Add Report
				</Typography>
				<form
					onSubmit={handleSubmit(onSubmit, onError)}
					className={classes.form}
					noValidate
				>
					<Controller
						name="unit_code"
						control={control}
						render={({ field: { ref, ...rest }, fieldState: { error } }) => (
							<TextField
								{...rest}
								select
								innerRef={ref}
								variant="outlined"
								margin="normal"
								required
								fullWidth
								id="unit_code"
								label="Unit Code"
								error={error ? true : false}
								helperText={
									error?.message ??
									`please select the unit code for your report`
								}
							>
								{units.map(({ unit_code }) => (
									<MenuItem key={unit_code} value={unit_code}>
										{unit_code}
									</MenuItem>
								))}
							</TextField>
						)}
					/>
					<Controller
						name="prac_name"
						control={control}
						render={({ field: { ref, ...rest }, fieldState: { error } }) => (
							<TextField
								{...rest}
								select
								innerRef={ref}
								variant="outlined"
								margin="normal"
								required
								fullWidth
								id="prac_name"
								label="Prac Name"
								error={error ? true : false}
								helperText={
									error?.message ??
									`please select the prac name for your report`
								}
							>
								{practicals
									.filter(({ unit_code }) => unit_code === unitCode)
									.map(({ prac_id, prac_name }) => (
										<MenuItem key={prac_id} value={prac_name}>
											{prac_name}
										</MenuItem>
									))}
							</TextField>
						)}
					/>
					<FileInput name="report" control={control} />
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
