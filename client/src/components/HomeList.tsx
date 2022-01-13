import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%',
			maxWidth: 500,
			maxHeight: 400,
			overflow: 'auto',
		},
	})
);

export default function InsetList() {
	const classes = useStyles();

	return (
		<List component="nav" className={classes.root} aria-label="contacts">
			{[0, 1, 2, 3, 4, 5].map((value) => (
				<Box p={1}>
					<Paper>
						<ListItem>
							<ListItemText primary={`Activity ${value + 1} `} />
						</ListItem>
					</Paper>
				</Box>
			))}
		</List>
	);
}
