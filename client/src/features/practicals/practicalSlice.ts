import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Error } from '../auth/authSlice';
import authHeader from '../auth/authHeader';
import { toast } from 'react-toastify';

export interface PracticalState {
	practicals: Practical[];
	status: 'loading' | 'failed' | 'success' | 'idle';
	error: Error;
}

export interface Practical {
	prac_id: number | null;
	unit_code: string;
	labtech_id: string;
	prac_name: string;
	abstract: string;
	lab_manual: string;
}

const initialState: PracticalState = {
	practicals: [
		{
			prac_id: null,
			unit_code: '',
			labtech_id: '',
			prac_name: '',
			abstract: '',
			lab_manual: '',
		},
	],
	status: 'idle',
	error: {
		status: null,
		message: '',
	},
};

export const fetchAllPracticals = createAsyncThunk(
	'practicals/fetchAllPracticals',
	async (value, thunkAPI) => {
		try {
			const response = await fetch('/practicals', {
				headers: {
					'Content-Type': 'application/json',
					...authHeader(),
				},
			});
			const data = (await response.json()) as Practical[];
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

export const fetchPracticalsByYear = createAsyncThunk(
	'practicals/fetchPracticalsByYear',
	async (value, { getState, rejectWithValue }) => {
		try {
			const { auth } = getState() as RootState;
			const response = await fetch(`/practicals/${auth.user.id}`, {
				headers: {
					'Content-Type': 'application/json',
					...authHeader(),
				},
			});
			const data = (await response.json()) as Practical[];
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

export const addPractical = createAsyncThunk(
	'practicals/addPractical',
	async (
		{
			labtech_id,
			unit_code,
			prac_name,
			abstract,
			lab_manual,
		}: {
			labtech_id: string;
			unit_code: string;
			prac_name: string;
			abstract: string;
			lab_manual: FileList;
		},
		thunkAPI
	) => {
		try {
			const formData = new FormData();
			formData.append('file', lab_manual[0]);
			formData.append('unit_code', unit_code);
			formData.append('labtech_id', labtech_id);
			formData.append('prac_name', prac_name);
			formData.append('abstract', abstract);
			console.log(formData);

			const response = await fetch('/practicals', {
				method: 'POST',
				body: formData,
				headers: {
					...authHeader(),
				},
			});
			const data = await response.json();
			if (response.status === 200) {
				toast.success('practical added successfully');
				console.log('add prac res', data[0]);
				return data[0];
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (error) {
			console.log(error.response.data);
			thunkAPI.rejectWithValue(error.response.data);
		}
	}
);

export const downloadLabManual = createAsyncThunk(
	'practicals/downloadLabManual',
	async (file: string, { rejectWithValue }) => {
		try {
			const response = await fetch(`/uploads/download/${file}`, {
				headers: {
					...authHeader(),
				},
			});
			const data = await response.blob();
			let url = await window.URL.createObjectURL(data);
			let a = document.createElement('a');
			if (response.status === 200) {
				a.href = url;
				a.download = url.substring(url.lastIndexOf('/') + 1);
				document.body.appendChild(a);
				a.click();
				a.remove();
				return;
			} else {
				return rejectWithValue(data);
			}
		} catch (error) {
			console.log(error.response.data);
			rejectWithValue(error.response.data);
		}
	}
);

export const practicalSlice = createSlice({
	name: 'practicals',
	initialState,
	reducers: {
		clearError: (state) => {
			state.error = {
				status: null,
				message: '',
			};
		},
		setStatusIdle: (state) => {
			state.status = 'idle';
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAllPracticals.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchAllPracticals.fulfilled, (state, action) => {
				state.status = 'success';
				state.practicals = action.payload ?? [
					{
						prac_id: null,
						unit_code: '',
						labtech_id: '',
						prac_name: '',
						abstract: '',
						lab_manual: '',
					},
				];
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(fetchAllPracticals.rejected, (state, action: any) => {
				state.status = 'failed';
				state.error = action?.payload;
			})
			.addCase(fetchPracticalsByYear.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchPracticalsByYear.fulfilled, (state, action) => {
				state.status = 'success';
				state.practicals = action.payload ?? [
					{
						prac_id: null,
						unit_code: '',
						labtech_id: '',
						prac_name: '',
						abstract: '',
						lab_manual: '',
					},
				];
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(fetchPracticalsByYear.rejected, (state, action: any) => {
				state.status = 'failed';
				state.error = action?.payload;
			})
			.addCase(addPractical.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(addPractical.fulfilled, (state) => {
				state.status = 'success';
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(addPractical.rejected, (state, action: any) => {
				state.status = 'failed';
				state.error = action?.payload;
			})
			.addCase(downloadLabManual.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(downloadLabManual.fulfilled, (state) => {
				state.status = 'success';
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(downloadLabManual.rejected, (state, action: any) => {
				state.status = 'failed';
				state.error = action?.payload;
			});
	},
});

export const { clearError, setStatusIdle } = practicalSlice.actions;
export const practicalState = (state: RootState) => state.practicals;

export default practicalSlice.reducer;
