import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import SubTable from './SubTable';
import { Equipment } from './equipmentSlice';

const useRowStyles = makeStyles({
	root: {
		'& > *': {
			borderBottom: 'unset',
		},
	},
});

interface Props {
	row: Equipment;
}

export default function EquipmentRow({ row }: Props) {
	const [open, setOpen] = React.useState(false);
	const classes = useRowStyles();

	return (
		<>
			<TableRow className={classes.root}>
				<TableCell>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}
					>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">
					{row.equipment_name}
				</TableCell>
				<TableCell align="right">{row.total}</TableCell>
				<TableCell align="right">{row.total - row.bad_condition}</TableCell>
				<TableCell align="right">{row.bad_condition}</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box margin={1}>
							<SubTable equipment={row} />
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
}
