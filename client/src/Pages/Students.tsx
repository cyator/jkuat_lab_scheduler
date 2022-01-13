import React, { useEffect } from 'react';
import StudentTabs from '../features/tabs/StudentTabs';
import StudentsTabChild from '../features/tabs/StudentsTabChild';
import {
	fetchAllGroups,
	clearError,
	groupState,
} from '../features/groups/groupsSlice';
import { toast } from 'react-toastify';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
	fetchAllStudents,
	clearError as clearStudentError,
	studentState,
} from '../features/students/studentsSlice';
import FloatingActionButton from '../components/FloatingActionButton';
import { Add as AddIcon } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { authState } from '../features/auth/authSlice';
import {
	fetchUser,
	profileState,
	clearError as clearProfileError,
	StudentProfile,
} from '../features/profile/profileSlice';
import { setValue } from '../features/tabs/tabsSlice';

function Students() {
	const { error } = useAppSelector(groupState);
	const { error: studentError } = useAppSelector(studentState);
	const { user } = useAppSelector(authState);
	const { profile, error: profileError } = useAppSelector(profileState);
	const dispatch = useAppDispatch();
	const { year_of_study } = profile as StudentProfile;

	useEffect(() => {
		dispatch(fetchAllGroups());
	}, [dispatch]);

	useEffect(() => {
		if (error.status) {
			console.log(error);
			toast.error(error.message);
			dispatch(clearError());
		}
	}, [error, dispatch]);

	useEffect(() => {
		dispatch(fetchAllStudents());
	}, [dispatch]);

	useEffect(() => {
		if (studentError.status) {
			console.log(studentError);
			toast.error(studentError.message);
			dispatch(clearStudentError());
		}
	}, [dispatch, studentError]);

	useEffect(() => {
		const { id, role } = user;
		role === 'classrep' && dispatch(fetchUser(id));
	}, [dispatch, user]);

	useEffect(() => {
		if (profileError.status) {
			console.log(profileError);
			toast.error(profileError.message);
			dispatch(clearProfileError());
		}
	}, [profileError, dispatch]);

	useEffect(() => {
		if (year_of_study) {
			dispatch(setValue(year_of_study - 1));
		}
	}, [dispatch, year_of_study]);

	return (
		<div>
			<StudentTabs
				lock={
					user.role === 'classrep' && year_of_study ? year_of_study : undefined
				}
				render={() => <StudentsTabChild />}
			/>
			{user.role === 'classrep' && (
				<Link to="/add-group">
					<FloatingActionButton icon={<AddIcon />} />
				</Link>
			)}
		</div>
	);
}

export default Students;
