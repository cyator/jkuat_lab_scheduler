import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Error } from '../auth/authSlice';
import authHeader from '../auth/authHeader';

export interface EquipmentState {
	equipments: Equipment[];
	isLoading: boolean;
	error: Error;
}

export interface Equipment {
	equipment_id: number | null;
	equipment_name: string;
	total: number;
	bad_condition: number;
}

const initialState: EquipmentState = {
	equipments: [
		{
			equipment_id: null,
			equipment_name: '',
			total: 0,
			bad_condition: 0,
		},
	],
	isLoading: false,
	error: {
		status: null,
		message: '',
	},
};

export const fetchAllEquipments = createAsyncThunk(
	'equipments/fetchAllEquipments',
	async (value, thunkAPI) => {
		try {
			const response = await fetch('/equipment', {
				headers: {
					'Content-Type': 'application/json',
					...authHeader(),
				},
			});
			const data = (await response.json()) as [Equipment];
			if (response.status === 200) {
				return data;
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (error) {
			console.log(error.response.data);
			thunkAPI.rejectWithValue(error.response.data);
		}
	}
);

export const equipmentsSlice = createSlice({
	name: 'equipments',
	initialState,
	reducers: {
		clearError: (state) => {
			state.error = {
				status: null,
				message: '',
			};
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAllEquipments.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchAllEquipments.fulfilled, (state, action) => {
				state.isLoading = true;
				state.equipments = action.payload ?? [
					{
						equipment_id: null,
						equipment_name: '',
						total: 0,
						bad_condition: 0,
					},
				];
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(fetchAllEquipments.rejected, (state, action: any) => {
				state.isLoading = true;
				state.error = action?.payload;
			});
	},
});

export const { clearError } = equipmentsSlice.actions;
export const equipmentState = (state: RootState) => state.equipments;

export default equipmentsSlice.reducer;
