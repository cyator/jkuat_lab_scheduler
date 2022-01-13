import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { tabValue } from './tabsSlice';
import {
	fetchMarkedReports,
	fetchPendingReports,
	reportsState,
} from '../reports/reportsSlice';
import { levels } from './MarksTabs';
import TabPanel from '../../components/TabPanel';
import MarksTable from '../../components/MarksTable';

function MarksTabChild() {
	const value = useAppSelector(tabValue);
	const { pendingReports, markedReports } = useAppSelector(reportsState);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchPendingReports());
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchMarkedReports());
	}, [dispatch]);

	return (
		<>
			{levels.map((level, index) => (
				<TabPanel value={value} index={index} key={index}>
					<MarksTable rows={index === 0 ? pendingReports : markedReports} />
				</TabPanel>
			))}
		</>
	);
}

export default MarksTabChild;
