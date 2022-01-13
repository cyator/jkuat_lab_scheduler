import React, { ReactElement } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Fab } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		fab: {
			position: 'fixed',
			bottom: theme.spacing(2),
			right: theme.spacing(2),
		},
	})
);

interface Props {
	icon: ReactElement;
}
function FloatingActionButton({ icon }: Props) {
	const classes = useStyles();
	return (
		<Fab
			className={classes.fab}
			color="primary"
			aria-label="add"
			style={{ position: 'fixed' }}
		>
			{icon}
		</Fab>
	);
}

export default FloatingActionButton;
