import React, { useEffect } from 'react';
import { Add as AddIcon } from '@material-ui/icons';
import StudentTabs from '../features/tabs/StudentTabs';
import PracticalTabChild from '../features/tabs/PracticalTabChild';
import FloatingActionButton from '../components/FloatingActionButton';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
	fetchAllUnits,
	clearError,
	unitState,
} from '../features/units/unitsSlice';
import {
	practicalState,
	clearError as clearPracticalsError,
	fetchAllPracticals,
} from '../features/practicals/practicalSlice';
import { authState } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import Pdf from '../components/Pdf';
import { modalState } from '../features/modal/modalSlice';

function Practicals() {
	const { error } = useAppSelector(unitState);
	const { error: PracticalsError } = useAppSelector(practicalState);
	const { user } = useAppSelector(authState);
	const { file } = useAppSelector(modalState);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(fetchAllUnits());
	}, [dispatch]);

	useEffect(() => {
		if (error.status) {
			console.log(error);
			toast.error(error.message);
			dispatch(clearError());
		}
	}, [error, dispatch]);

	useEffect(() => {
		dispatch(fetchAllPracticals());
	}, [dispatch]);

	useEffect(() => {
		if (PracticalsError.status) {
			console.log(PracticalsError);
			toast.error(PracticalsError.message);
			dispatch(clearPracticalsError());
		}
	}, [error, dispatch, PracticalsError]);

	return (
		<div>
			<StudentTabs render={() => <PracticalTabChild />} />
			{user.role === 'labtech' && (
				<Link to="/add-practical">
					<FloatingActionButton icon={<AddIcon />} />
				</Link>
			)}
			<Modal render={() => <Pdf file={file} />} />
		</div>
	);
}

export default Practicals;
