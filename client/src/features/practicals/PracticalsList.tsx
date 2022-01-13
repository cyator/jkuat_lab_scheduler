import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useAppSelector } from '../../app/hooks';
import { practicalState } from './practicalSlice';
import PracticalCard from '../../components/PracticalCard';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			flexGrow: 1,
		},
	})
);
interface Props {
	unit: string;
}
export default function PracticalsList({ unit }: Props) {
	const classes = useStyles();
	const { practicals } = useAppSelector(practicalState);

	return (
		<Grid container className={classes.root} spacing={2}>
			{practicals.map(
				({ prac_id, prac_name, abstract, unit_code, lab_manual }) =>
					unit_code === unit && (
						<>
							<Grid key={prac_id} item xs={3}>
								<PracticalCard
									title={prac_name}
									abstract={abstract}
									lab_manual={lab_manual}
								/>
							</Grid>
						</>
					)
			)}
		</Grid>
	);
}
