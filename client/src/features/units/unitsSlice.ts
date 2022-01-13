import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Error } from '../auth/authSlice';
import authHeader from '../auth/authHeader';

export interface UnitState {
	units: Unit[];
	isLoading: boolean;
	error: Error;
}

export interface Unit {
	unit_code: string;
	unit_name: string;
	lec_id: string;
	unit_year: number | null;
}

const initialState: UnitState = {
	units: [
		{
			unit_code: '',
			unit_name: '',
			lec_id: '',
			unit_year: null,
		},
	],
	isLoading: false,
	error: {
		status: null,
		message: '',
	},
};

export const fetchAllUnits = createAsyncThunk(
	'units/fetchAllUnits',
	async (value, thunkAPI) => {
		try {
			const response = await fetch('/units', {
				headers: {
					'Content-Type': 'application/json',
					...authHeader(),
				},
			});
			const data = (await response.json()) as Unit[];
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

export const fetchUnitsByYear = createAsyncThunk(
	'units/fetchUnitsByYear',
	async (value, { getState, rejectWithValue }) => {
		try {
			const { auth } = getState() as RootState;
			const response = await fetch(`/units/${auth.user.id}`, {
				headers: {
					'Content-Type': 'application/json',
					...authHeader(),
				},
			});
			const data = (await response.json()) as Unit[];
			if (response.status === 200) {
				return data;
			} else {
				return rejectWithValue(data);
			}
		} catch (error) {
			console.log(error.response.data);
			rejectWithValue(error.response.data);
		}
	}
);

export const unitsSlice = createSlice({
	name: 'units',
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
			.addCase(fetchAllUnits.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchAllUnits.fulfilled, (state, action) => {
				state.isLoading = true;
				state.units = action.payload ?? [
					{
						unit_code: '',
						unit_name: '',
						lec_id: '',
						unit_year: null,
					},
				];
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(fetchAllUnits.rejected, (state, action: any) => {
				state.isLoading = true;
				state.error = action?.payload;
			})
			.addCase(fetchUnitsByYear.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchUnitsByYear.fulfilled, (state, action) => {
				state.isLoading = true;
				state.units = action.payload ?? [
					{
						unit_code: '',
						unit_name: '',
						lec_id: '',
						unit_year: null,
					},
				];
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(fetchUnitsByYear.rejected, (state, action: any) => {
				state.isLoading = true;
				state.error = action?.payload;
			});
	},
});

export const { clearError } = unitsSlice.actions;
export const unitState = (state: RootState) => state.units;

export default unitsSlice.reducer;
