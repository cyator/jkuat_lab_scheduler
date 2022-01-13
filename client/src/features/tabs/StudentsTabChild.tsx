import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

import { useAppSelector } from '../../app/hooks';
import { tabValue } from './tabsSlice';
import { groupState } from '../groups/groupsSlice';
import { levels } from './StudentTabs';
import TabPanel from '../../components/TabPanel';
import StudentTable from '../../components/StudentTable';
import Accordion from '../../components/Accordion';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		accordion: {
			width: '100%',
		},
	})
);

function StudentTabChild() {
	const classes = useStyles();
	const value = useAppSelector(tabValue);
	const { groups } = useAppSelector(groupState);

	return (
		<>
			{levels.map((level, index) => (
				<TabPanel value={value} index={index} key={index}>
					<div className={classes.accordion}>
						{groups.map(
							({ year_of_study, group_name, group_id }) =>
								year_of_study === index + 1 && (
									<Accordion
										key={group_id}
										name={group_name}
										render={() => <StudentTable group={group_id} />}
									/>
								)
						)}
					</div>
				</TabPanel>
			))}
		</>
	);
}

export default StudentTabChild;
