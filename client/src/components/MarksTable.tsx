import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Report } from '../features/reports/reportsSlice';
import MarksTableRow from './MarksTableRow';

const useStyles = makeStyles({
	table: {
		minWidth: 650,
	},
});

interface Props {
	rows: Report[];
}

export type FormData = {
	marks: number;
	report_id: number | null;
};

export default function MarksTable({ rows }: Props) {
	const classes = useStyles();

	return (
		<TableContainer component={Paper}>
			<Table className={classes.table} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>Unit Code</TableCell>
						<TableCell>Group Name</TableCell>
						<TableCell>Prac Name</TableCell>
						<TableCell>Report</TableCell>
						<TableCell>Marks</TableCell>
						<TableCell></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{rows.map((row) => (
						<MarksTableRow row={row} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
