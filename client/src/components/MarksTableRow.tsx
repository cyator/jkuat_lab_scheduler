import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { Button, TextField } from '@material-ui/core';
import {
	addMarks,
	downloadReport,
	Report,
} from '../features/reports/reportsSlice';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAppDispatch } from '../app/hooks';

interface Props {
	row: Report;
}

export type FormData = {
	marks: number;
	report_id: number | null;
};

const schema = yup.object().shape({
	marks: yup.number().required(),
});

function MarksTableRow({ row }: Props) {
	const { control, handleSubmit } = useForm<FormData>({
		resolver: yupResolver(schema),
	});
	const dispatch = useAppDispatch();

	const onSubmit =
		(report_id: number | null): SubmitHandler<FormData> =>
		(data) =>
			dispatch(addMarks({ marks: data.marks, report_id }));

	return (
		<TableRow key={row.unit_code}>
			<TableCell component="th" scope="row">
				{row.unit_code}
			</TableCell>
			<TableCell>{row.group_name}</TableCell>
			<TableCell>{row.prac_name}</TableCell>
			<TableCell>
				{row.prac_name && (
					<Button
						color="primary"
						variant="outlined"
						onClick={() => dispatch(downloadReport(row.report_name))}
					>
						Download report
					</Button>
				)}
			</TableCell>

			<TableCell>
				{row.prac_name && (
					<Controller
						control={control}
						name="marks"
						// defaultValue={row.marks ?? 0}
						render={({
							field: { ref, ...inputProps },
							fieldState: { error },
						}) => (
							<TextField
								type="number"
								disabled={row.marks ? true : false}
								{...inputProps}
								required
								value={row.marks && row.marks}
								id="marks"
								inputRef={ref}
								error={error ? true : false}
								helperText={
									error?.message ?? !row.marks
										? `please type in the marks of the report`
										: ''
								}
							/>
						)}
					/>
				)}
			</TableCell>
			<TableCell>
				{row.prac_name && (
					<Button
						onClick={
							row.marks
								? () => alert('coming soon')
								: handleSubmit(onSubmit(row.report_id))
						}
						variant="contained"
						color="primary"
					>
						{row.marks ? 'Edit' : 'Submit'}
					</Button>
				)}
			</TableCell>
		</TableRow>
	);
}

export default MarksTableRow;
