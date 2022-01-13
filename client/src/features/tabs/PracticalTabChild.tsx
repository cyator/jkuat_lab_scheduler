import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

import { useAppSelector } from '../../app/hooks';
import { tabValue } from './tabsSlice';
import TabPanel from '../../components/TabPanel';
import { unitState } from '../units/unitsSlice';
import { levels } from './StudentTabs';
import Accordion from '../../components/Accordion';
import PracticalsList from '../practicals/PracticalsList';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		accordion: {
			width: '100%',
		},
	})
);

function PracticalTabChild() {
	const classes = useStyles();
	const value = useAppSelector(tabValue);
	const { units } = useAppSelector(unitState);

	return (
		<>
			{levels.map((level, index) => (
				<TabPanel value={value} index={index}>
					<div className={classes.accordion}>
						{units.map(
							({ unit_name, unit_year, unit_code }) =>
								unit_year === index + 1 && (
									<Accordion
										key={unit_code}
										name={unit_name}
										render={() => <PracticalsList unit={unit_code} />}
									/>
								)
						)}
					</div>
				</TabPanel>
			))}
		</>
	);
}

export default PracticalTabChild;
