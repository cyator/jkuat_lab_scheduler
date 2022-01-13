import React, { useEffect } from 'react';
import AddReports from '../components/forms/reports/AddReports';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
	unitState,
	fetchUnitsByYear,
	clearError as clearUnitsError,
} from '../features/units/unitsSlice';
import {
	practicalState,
	fetchPracticalsByYear,
	clearError as clearPracticalError,
} from '../features/practicals/practicalSlice';
import { toast } from 'react-toastify';

function Reports() {
	const { units, error: unitsError } = useAppSelector(unitState);
	const { practicals, error: practicalsError } = useAppSelector(practicalState);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchUnitsByYear());
	}, [dispatch]);

	useEffect(() => {
		if (unitsError.status) {
			console.log(unitsError);
			toast.error(unitsError.message);
			dispatch(clearUnitsError());
		}
	}, [unitsError, dispatch]);

	useEffect(() => {
		dispatch(fetchPracticalsByYear());
	}, [dispatch]);

	useEffect(() => {
		if (practicalsError.status) {
			console.log(practicalsError);
			toast.error(practicalsError.message);
			dispatch(clearPracticalError());
		}
	}, [practicalsError, dispatch]);

	return (
		<div>
			<AddReports units={units} practicals={practicals} />
		</div>
	);
}

export default Reports;
