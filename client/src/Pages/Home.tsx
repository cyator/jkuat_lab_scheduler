import React from 'react';
import LabTechHome from '../components/LabTechHome';
import { useAppSelector } from '../app/hooks';
import { authState } from '../features/auth/authSlice';

function Home() {
	const { user } = useAppSelector(authState);
	return (
		<div>
			<LabTechHome name={user.name} />
		</div>
	);
}

export default Home;
