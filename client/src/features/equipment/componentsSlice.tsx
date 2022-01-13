import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Error } from '../auth/authSlice';
import authHeader from '../auth/authHeader';

export interface ComponentsState {
	components: Component[];
	isLoading: boolean;
	error: Error;
}

export interface Component {
	id: number;
	name: string;
	good_condition: number;
	bad_condition: number;
	quantity: number;
}

const initialState: ComponentsState = {
	components: [
		{
			id: 0,
			name: '',
			good_condition: 0,
			bad_condition: 0,
			quantity: 0,
		},
	],
	isLoading: false,
	error: {
		status: null,
		message: '',
	},
};

export const fetchAllComponents = createAsyncThunk(
	'components/fetchAllComponents',
	async (name: string, thunkAPI) => {
		try {
			const response = await fetch(`/equipment/${name}`, {
				headers: {
					'Content-Type': 'application/json',
					...authHeader(),
				},
			});
			const data = (await response.json()) as Component[];
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

export const componentsSlice = createSlice({
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
			.addCase(fetchAllComponents.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchAllComponents.fulfilled, (state, action) => {
				state.isLoading = true;
				state.components = action.payload ?? [
					{
						id: 0,
						name: '',
						good_condition: 0,
						bad_condition: 0,
						quantity: 0,
					},
				];
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(fetchAllComponents.rejected, (state, action: any) => {
				state.isLoading = true;
				state.error = action?.payload;
			});
	},
});

export const { clearError } = componentsSlice.actions;
export const componentState = (state: RootState) => state.components;

export default componentsSlice.reducer;
