import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Error } from '../auth/authSlice';
import authHeader from '../auth/authHeader';

export interface StudentState {
	students: Student[];
	isLoading: boolean;
	error: Error;
}

export interface Student {
	reg_no: string;
	group_id: number | null;
	last_name: string;
	first_name: string;
	year_of_study: number | null;
}

const initialState: StudentState = {
	students: [
		{
			reg_no: '',
			group_id: null,
			last_name: '',
			first_name: '',
			year_of_study: null,
		},
	],
	isLoading: false,
	error: {
		status: null,
		message: '',
	},
};

export const fetchAllStudents = createAsyncThunk(
	'students/fetchAllStudents',
	async (value, { getState, rejectWithValue }) => {
		try {
			const { auth } = getState() as RootState;
			let response;
			if (auth.user.role === 'classrep') {
				response = await fetch(`/students/${auth.user.id}`, {
					headers: {
						'Content-Type': 'application/json',
						...authHeader(),
					},
				});
			} else {
				response = await fetch('/students', {
					headers: {
						'Content-Type': 'application/json',
						...authHeader(),
					},
				});
			}

			const data = (await response.json()) as Student[];
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

export const studentsSlice = createSlice({
	name: 'students',
	initialState,
	reducers: {
		setStudents: (state, { payload }: PayloadAction<Student[]>) => {
			state.students = payload;
		},
		clearError: (state) => {
			state.error = {
				status: null,
				message: '',
			};
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchAllStudents.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchAllStudents.fulfilled, (state, action) => {
				state.isLoading = false;
				state.students = action.payload ?? [
					{
						reg_no: '',
						group_id: null,
						last_name: '',
						first_name: '',
						year_of_study: null,
					},
				];
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(fetchAllStudents.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			});
	},
});

export const { clearError, setStudents } = studentsSlice.actions;
export const studentState = (state: RootState) => state.students;

export default studentsSlice.reducer;
