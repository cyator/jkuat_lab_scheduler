import React, { useEffect } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { Student } from '../features/students/studentsSlice';
import { studentState } from '../features/students/studentsSlice';
import { RemoveCircleOutline } from '@material-ui/icons';
import { Button, IconButton } from '@material-ui/core';
import {
	removeMember,
	groupState,
	fetchStudentsWithoutGroups,
	addMember,
} from '../features/groups/groupsSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { authState } from '../features/auth/authSlice';

export type FormData = {
	reg_no: string;
};

const schema = yup.object().shape({
	reg_no: yup.string().trim().required(),
});

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		table: {
			minWidth: 650,
		},
		heading: {
			fontWeight: theme.typography.fontWeightBold,
			textTransform: 'capitalize',
		},
		data: {
			textTransform: 'capitalize',
		},
	})
);

interface Props {
	group: number | null;
}

export default function StudentTable({ group }: Props) {
	const classes = useStyles();
	const { students } = useAppSelector(studentState);
	const { user } = useAppSelector(authState);
	const dispatch = useAppDispatch();
	const { studentsWithoutGroups } = useAppSelector(groupState);
	const { control, handleSubmit } = useForm<FormData>({
		resolver: yupResolver(schema),
	});

	const onSubmit = handleSubmit((data) =>
		dispatch(addMember({ group_id: group, ...data }))
	);

	useEffect(() => {
		user.role === 'classrep' && dispatch(fetchStudentsWithoutGroups());
	}, [dispatch, user.role]);

	return (
		<TableContainer component={Paper}>
			<Table className={classes.table} size="small" aria-label="student table">
				<TableHead>
					<TableRow>
						<TableCell className={classes.heading}>
							Registration Number
						</TableCell>
						<TableCell className={classes.heading} align="left">
							First Name
						</TableCell>
						<TableCell className={classes.heading} align="left">
							Last Name
						</TableCell>
						{user.role === 'classrep' && (
							<TableCell className={classes.heading} align="right">
								<Controller
									name="reg_no"
									control={control}
									render={({
										field: { ref, ...rest },
										fieldState: { error },
									}) => (
										<TextField
											{...rest}
											innerRef={ref}
											id="reg_no"
											required
											error={error ? true : false}
											select
											fullWidth
											helperText={error?.message ?? 'Choose a member'}
										>
											{studentsWithoutGroups.map(({ reg_no }: Student) => (
												<MenuItem key={reg_no} value={reg_no}>
													{reg_no}
												</MenuItem>
											))}
										</TextField>
									)}
								/>
								<Button onClick={onSubmit} color="primary">
									Add Member
								</Button>
							</TableCell>
						)}
					</TableRow>
				</TableHead>
				<TableBody>
					{students.map(
						({ reg_no, group_id, last_name, first_name }: Student) =>
							group === group_id && (
								<TableRow key={reg_no}>
									<TableCell component="th" scope="row">
										{reg_no}
									</TableCell>
									<TableCell className={classes.data} align="left">
										{first_name}
									</TableCell>
									<TableCell className={classes.data} align="left">
										{last_name}
									</TableCell>
									{user.role === 'classrep' && (
										<TableCell className={classes.data} align="right">
											<IconButton
												onClick={() =>
													dispatch(removeMember({ reg_no, group_id }))
												}
											>
												<RemoveCircleOutline color="secondary" />
											</IconButton>
										</TableCell>
									)}
								</TableRow>
							)
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
