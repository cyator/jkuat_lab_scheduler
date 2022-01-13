import React, { ChangeEvent, ReactNode } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { tabValue, setValue } from './tabsSlice';

function a11yProps(index: any) {
	return {
		id: `scrollable-auto-tab-${index}`,
		'aria-controls': `scrollable-auto-tabpanel-${index}`,
	};
}

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		flexGrow: 1,
		width: '100%',
		backgroundColor: theme.palette.background.paper,
	},
}));

interface Props {
	render: () => ReactNode;
	lock?: number;
}

export const levels: string[] = [
	'First Year',
	'Second Year',
	'Third Year',
	'Fourth Year',
	'Fifth Year',
];

export default function StudentTabs({ render, lock }: Props) {
	const classes = useStyles();
	const dispatch = useAppDispatch();
	const value = useAppSelector(tabValue);

	const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
		dispatch(setValue(newValue));
	};

	return (
		<div className={classes.root}>
			<AppBar position="static" color="default">
				<Tabs
					value={value}
					onChange={handleChange}
					indicatorColor="primary"
					textColor="primary"
					variant="fullWidth"
					aria-label="tabs"
				>
					{levels.map((level, index) => (
						<Tab
							disabled={!lock ? false : lock === index + 1 ? false : true}
							key={index}
							label={level}
							{...a11yProps(index)}
						/>
					))}
				</Tabs>
			</AppBar>
			{render()}
		</div>
	);
}
