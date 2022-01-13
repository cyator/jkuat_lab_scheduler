import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { Box, Paper, Typography } from '@material-ui/core';
import HomeList from './HomeList';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		paper: {
			width: '100%',
			maxWidth: 548,
		},
	})
);

interface Props {
	name: string;
}

function LabTechHome({ name }: Props) {
	const classes = useStyles();

	return (
		<div>
			<Box px={3} py={5}>
				<Typography variant="h4">{`Welcome Back, ${name}!`}</Typography>
				<Typography variant="subtitle1">Lorem ipsum dolor sit amet.</Typography>
			</Box>
			<Paper className={classes.paper}>
				<Box p={3}>
					<Typography variant="h6">Your Activities</Typography>
					<HomeList />
				</Box>
			</Paper>
		</div>
	);
}

export default LabTechHome;
