import React, { ReactNode } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Accordion as MUIAccordion } from '@material-ui/core';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		heading: {
			fontSize: theme.typography.pxToRem(15),
			fontWeight: theme.typography.fontWeightBold,
		},
	})
);

interface Props {
	name: string;
	render: () => ReactNode;
}

export default function Accordion({ name, render }: Props) {
	const classes = useStyles();

	return (
		<MUIAccordion>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1a-content"
				id="panel1a-header"
			>
				<Typography variant="button" className={classes.heading}>
					{name}
				</Typography>
			</AccordionSummary>
			<AccordionDetails>{render()}</AccordionDetails>
		</MUIAccordion>
	);
}
