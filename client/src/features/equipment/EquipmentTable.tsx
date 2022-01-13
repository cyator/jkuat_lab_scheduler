import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import EquipmentRow from './EquipmentRow';
import { Equipment } from './equipmentSlice';

// export interface Row {
// 	name: string;
// 	total: number;
// 	badCondition: number;
// 	goodCondition: number;
// 	borrowed: number;
// }

// const rows: Row[] = [
// 	{
// 		name: 'Resistor',
// 		total: 159,
// 		badCondition: 6,
// 		goodCondition: 24,
// 		borrowed: 3,
// 	},
// ];

interface Props {
	equipment: Equipment[];
}

export default function CollapsibleTable({ equipment }: Props) {
	return (
		<TableContainer component={Paper}>
			<Table aria-label="collapsible table">
				<TableHead>
					<TableRow>
						<TableCell />
						<TableCell>Equipment</TableCell>
						<TableCell align="right">Total</TableCell>
						<TableCell align="right">Good Condition</TableCell>
						<TableCell align="right">Bad Condition</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{equipment.map((row, index) => (
						<EquipmentRow key={row.equipment_id} row={row} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
