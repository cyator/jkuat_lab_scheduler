import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import authHeader from '../auth/authHeader';
import { Error } from '../auth/authSlice';

export interface ProfileState {
	profile: StudentProfile | LecturerProfile | LabtechProfile;
	isLoading: boolean;
	error: Error;
}

export interface StudentProfile {
	id: string;
	first_name: string;
	last_name: string;
	group_id: number | null;
	year_of_study: number | null;
}

export interface LecturerProfile {
	id: string;
	first_name: string;
	last_name: string;
}

export interface LabtechProfile {
	id: string;
	first_name: string;
	last_name: string;
}

const initialState: ProfileState = {
	profile: {
		id: '',
		first_name: '',
		last_name: '',
	},
	isLoading: false,
	error: {
		status: null,
		message: '',
	},
};

export const fetchUser = createAsyncThunk(
	'profile/fetchUser',
	async (id: string, thunkAPI) => {
		try {
			const response = await fetch(`/auth/user/${id}`, {
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
					...authHeader(),
				},
			});
			const data = (await response.json()) as
				| StudentProfile
				| LabtechProfile
				| LecturerProfile;
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

export const profileSlice = createSlice({
	name: 'profile',
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
			.addCase(fetchUser.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchUser.fulfilled, (state, { payload }) => {
				state.isLoading = false;
				state.profile = payload ?? {
					id: '',
					first_name: '',
					last_name: '',
				};
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(fetchUser.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			});
	},
});

export const { clearError } = profileSlice.actions;

export const profileState = (state: RootState) => state.profile;

export default profileSlice.reducer;
