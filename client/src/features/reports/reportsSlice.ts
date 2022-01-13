import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Error } from '../auth/authSlice';
import authHeader from '../auth/authHeader';
import { toast } from 'react-toastify';

export interface PracticalState {
	markedReports: Report[];
	pendingReports: Report[];
	status: 'loading' | 'failed' | 'success' | 'idle';
	error: Error;
}

export interface Report {
	report_id: number | null;
	unit_code: string;
	group_name: string;
	prac_name: string;
	report_name: string;
	marks: number | null;
}

const initialState: PracticalState = {
	markedReports: [
		{
			report_id: null,
			unit_code: '',
			group_name: '',
			prac_name: '',
			report_name: '',
			marks: null,
		},
	],
	pendingReports: [
		{
			report_id: null,
			unit_code: '',
			group_name: '',
			prac_name: '',
			report_name: '',
			marks: null,
		},
	],
	status: 'idle',
	error: {
		status: null,
		message: '',
	},
};

export const fetchMarkedReports = createAsyncThunk(
	'reports/fetchMarkedReports',
	async (value, { getState, rejectWithValue }) => {
		try {
			const { auth } = getState() as RootState;
			const response = await fetch(`/reports/marked/${auth.user.id}`, {
				headers: {
					'Content-Type': 'application/json',
					...authHeader(),
				},
			});
			const data = (await response.json()) as Report[];
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

export const fetchPendingReports = createAsyncThunk(
	'reports/fetchPendingReports',
	async (value, { getState, rejectWithValue }) => {
		try {
			const { auth } = getState() as RootState;
			const response = await fetch(`/reports/pending/${auth.user.id}`, {
				headers: {
					'Content-Type': 'application/json',
					...authHeader(),
				},
			});
			const data = (await response.json()) as Report[];
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

export const addReport = createAsyncThunk(
	'reports/addReport',
	async (
		{
			unit_code,
			prac_name,
			report,
		}: {
			unit_code: string;
			prac_name: string;
			report: FileList;
		},
		{ getState, rejectWithValue }
	) => {
		try {
			const { auth } = getState() as RootState;
			const formData = new FormData();
			formData.append('file', report[0]);
			formData.append('unit_code', unit_code);
			formData.append('prac_name', prac_name);
			formData.append('reg_no', auth.user.id);
			console.log(formData);

			const response = await fetch('/reports', {
				method: 'POST',
				body: formData,
				headers: {
					...authHeader(),
				},
			});
			const data = await response.json();
			if (response.status === 200) {
				toast.success('report added successfully');
				console.log('add prac res', data[0]);
				return data[0];
			} else {
				return rejectWithValue(data);
			}
		} catch (error) {
			console.log(error.response.data);
			rejectWithValue(error.response.data);
		}
	}
);

export const addMarks = createAsyncThunk(
	'reports/addMarks',
	async (
		{
			marks,
			report_id,
		}: {
			marks: number;
			report_id: number | null;
		},
		{ rejectWithValue, dispatch, getState }
	) => {
		try {
			const response = await fetch('/reports/addMarks', {
				method: 'POST',
				body: JSON.stringify({
					marks,
					report_id,
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
					...authHeader(),
				},
			});
			const data = (await response.json()) as Report[];
			if (response.status === 200) {
				toast.success('mark added successfully');
				dispatch(fetchMarkedReports());
				return data[0];
			} else {
				return rejectWithValue(data);
			}
		} catch (error) {
			console.log(error.response.data);
			rejectWithValue(error.response.data);
		}
	}
);

export const downloadReport = createAsyncThunk(
	'reports/downloadReport',
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

export const reportsSlice = createSlice({
	name: 'reports',
	initialState,
	reducers: {
		setMarkedReports: (state, { payload }: PayloadAction<Report[]>) => {
			state.markedReports = payload;
		},
		setPendingReports: (state, { payload }: PayloadAction<Report[]>) => {
			state.pendingReports = payload;
		},
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
			.addCase(fetchMarkedReports.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchMarkedReports.fulfilled, (state, action) => {
				state.status = 'success';
				state.markedReports = action.payload ?? [
					{
						report_id: null,
						unit_code: '',
						group_name: '',
						prac_name: '',
						report_name: '',
						marks: null,
					},
				];
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(fetchMarkedReports.rejected, (state, action: any) => {
				state.status = 'failed';
				state.error = action?.payload;
			})
			.addCase(fetchPendingReports.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(fetchPendingReports.fulfilled, (state, action) => {
				state.status = 'success';
				state.pendingReports = action.payload ?? [
					{
						report_id: null,
						unit_code: '',
						group_name: '',
						prac_name: '',
						report_name: '',
						marks: null,
					},
				];
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(fetchPendingReports.rejected, (state, action: any) => {
				state.status = 'failed';
				state.error = action?.payload;
			})
			.addCase(addReport.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(addReport.fulfilled, (state) => {
				state.status = 'success';
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(addReport.rejected, (state, action: any) => {
				state.status = 'failed';
				state.error = action?.payload;
			})
			.addCase(addMarks.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(addMarks.fulfilled, (state, { payload }) => {
				state.status = 'success';

				const filtered = state.pendingReports.filter(
					(report) => report.report_id !== payload?.report_id
				);
				state.pendingReports = filtered;
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(addMarks.rejected, (state, action: any) => {
				state.status = 'failed';
				state.error = action?.payload ?? {
					status: null,
					message: '',
				};
			})
			.addCase(downloadReport.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(downloadReport.fulfilled, (state) => {
				state.status = 'success';
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(downloadReport.rejected, (state, action: any) => {
				state.status = 'failed';
				state.error = action?.payload ?? {
					status: null,
					message: '',
				};
			});
	},
});

export const {
	clearError,
	setStatusIdle,
	setMarkedReports,
	setPendingReports,
} = reportsSlice.actions;
export const reportsState = (state: RootState) => state.reports;

export default reportsSlice.reducer;
