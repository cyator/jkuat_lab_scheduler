import React, { useEffect } from 'react';
import { Box, Paper } from '@material-ui/core';
import EquipmentTable from '../features/equipment/EquipmentTable';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
	clearError,
	fetchAllEquipments,
	equipmentState,
} from '../features/equipment/equipmentSlice';
import { toast } from 'react-toastify';

function Equipment() {
	const dispatch = useAppDispatch();
	const { error, equipments } = useAppSelector(equipmentState);
	useEffect(() => {
		dispatch(fetchAllEquipments());
	}, [dispatch]);

	useEffect(() => {
		if (error.status) {
			console.log(error);
			toast.error(error.message);
			dispatch(clearError());
		}
	}, [dispatch, error]);

	return (
		<div>
			<Paper>
				<Box p={4}>
					<EquipmentTable equipment={equipments} />
				</Box>
			</Paper>
		</div>
	);
}

export default Equipment;
