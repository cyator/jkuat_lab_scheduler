import React, { useEffect } from 'react';
import MarksTabs from '../features/tabs/MarksTabs';
import MarksTabChild from '../features/tabs/MarksTabsChild';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { reportsState, clearError } from '../features/reports/reportsSlice';
import { toast } from 'react-toastify';

function Marks() {
	const { error } = useAppSelector(reportsState);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (error.status) {
			console.log(error);
			toast.error(error.message);
			dispatch(clearError());
		}
	}, [error, dispatch]);

	return (
		<div>
			<MarksTabs render={() => <MarksTabChild />} />
		</div>
	);
}

export default Marks;
