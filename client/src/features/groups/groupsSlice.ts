import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { Error } from '../auth/authSlice';
import authHeader from '../auth/authHeader';
import { toast } from 'react-toastify';
import { setStudents, Student } from '../students/studentsSlice';

export interface GroupState {
	groups: Group[];
	studentsWithoutGroups: Student[];
	error: Error;
	isLoading: boolean;
}

export interface Group {
	group_id: number | null;
	group_name: string;
	year_of_study: number | null;
}

const initialState: GroupState = {
	groups: [
		{
			group_id: null,
			group_name: '',
			year_of_study: null,
		},
	],
	studentsWithoutGroups: [
		{
			reg_no: '',
			group_id: null,
			last_name: '',
			first_name: '',
			year_of_study: null,
		},
	],
	error: {
		status: null,
		message: '',
	},
	isLoading: false,
};

export const fetchAllGroups = createAsyncThunk(
	'groups/fetchAllGroups',
	async (value, thunkAPI) => {
		try {
			const response = await fetch('/groups', {
				headers: {
					'Content-Type': 'application/json',
					...authHeader(),
				},
			});
			const data = (await response.json()) as Group[];
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

export const createGroup = createAsyncThunk(
	'groups/createGroup',
	async ({ group_name }: { group_name: string }, thunkAPI) => {
		try {
			const response = await fetch('/groups/create', {
				method: 'POST',
				body: JSON.stringify({
					group_name,
				}),
				headers: {
					'Content-Type': 'application/json',
					...authHeader(),
				},
			});
			const data = await response.json();
			if (response.status === 200) {
				toast.success('group created successfully');
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

export const addMember = createAsyncThunk(
	'groups/addMember',
	async (
		{ reg_no, group_id }: { reg_no: string; group_id: number | null },
		{ getState, dispatch, rejectWithValue }
	) => {
		try {
			const response = await fetch('/groups/add-member', {
				method: 'POST',
				body: JSON.stringify({
					reg_no,
					group_id,
				}),
				headers: {
					'Content-Type': 'application/json',
					...authHeader(),
				},
			});
			const data = (await response.json()) as Student[];
			if (response.status === 200) {
				toast.success('member added successfully');
				const { students } = getState() as RootState;
				dispatch(setStudents([...students.students, data[0]]));
				dispatch(fetchStudentsWithoutGroups());
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

export const removeMember = createAsyncThunk(
	'groups/removeMember',
	async (
		{ reg_no, group_id }: { reg_no: string; group_id: number | null },
		{ getState, dispatch, rejectWithValue }
	) => {
		try {
			const response = await fetch('/groups/remove-member', {
				method: 'POST',
				body: JSON.stringify({
					reg_no,
					group_id,
				}),
				headers: {
					'Content-Type': 'application/json',
					...authHeader(),
				},
			});
			const data = (await response.json()) as Student[];
			console.log(data);

			if (response.status === 200) {
				const { students } = getState() as RootState;
				const filtered = students.students.filter(
					({ reg_no }) => reg_no !== data[0].reg_no
				);
				dispatch(setStudents(filtered));
				dispatch(fetchStudentsWithoutGroups());
				toast.success('member removed successfully');
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

export const fetchStudentsWithoutGroups = createAsyncThunk(
	'groups/fetchStudentsWithoutGroups',
	async (value, thunkAPI) => {
		try {
			const response = await fetch('/groups/students-without-groups', {
				headers: {
					'Content-Type': 'application/json',
					...authHeader(),
				},
			});
			const data = (await response.json()) as Student[];
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

export const groupsSlice = createSlice({
	name: 'groups',
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
			.addCase(fetchAllGroups.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchAllGroups.fulfilled, (state, action) => {
				state.isLoading = false;
				state.groups = action.payload ?? [
					{
						group_id: null,
						group_name: '',
						year_of_study: null,
					},
				];
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(fetchAllGroups.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			})
			.addCase(fetchStudentsWithoutGroups.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchStudentsWithoutGroups.fulfilled, (state, { payload }) => {
				state.isLoading = false;
				state.studentsWithoutGroups = payload ?? [
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
			.addCase(
				fetchStudentsWithoutGroups.rejected,
				(state, { payload }: any) => {
					state.isLoading = false;
					state.error = payload;
				}
			)
			.addCase(createGroup.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(createGroup.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(createGroup.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			})
			.addCase(addMember.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(addMember.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(addMember.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			})
			.addCase(removeMember.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(removeMember.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(removeMember.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			});
	},
});

export const { clearError } = groupsSlice.actions;
export const groupState = (state: RootState) => state.groups;

export default groupsSlice.reducer;
