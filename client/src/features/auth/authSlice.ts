import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jwt_decode from 'jwt-decode';
import { RootState } from '../../app/store';

export interface AuthState {
	isAuthenticated: boolean;
	user: User;
	profile: Profile | undefined;
	isLoading: boolean;
	error: Error;
}

interface User {
	token: string;
	role: string;
	id: string;
	name: string;
}

export interface Error {
	status: number | null;
	message: string;
}

export interface Credentials {
	email: string;
	password: string;
}

export interface Profile {
	id: string;
	firstName: string;
	lastName: string;
}

let user;
const res = localStorage.getItem('user') ?? '';
if (res) {
	user = JSON.parse(res);
}

const initialState: AuthState = user
	? {
			isAuthenticated: true,
			user: {
				token: user.token,
				role: user.role,
				id: user.id,
				name: user.name,
			},
			profile: undefined,
			isLoading: false,
			error: {
				status: null,
				message: '',
			},
	  }
	: {
			isAuthenticated: false,
			user: {
				token: '',
				role: '',
				id: '',
				name: '',
			},
			profile: undefined,
			isLoading: false,
			error: {
				status: null,
				message: '',
			},
	  };

export const attemptLogin = createAsyncThunk(
	'auth/attemptLogin',
	async ({ email, password }: Credentials, thunkAPI) => {
		try {
			const response = await fetch('/auth/login', {
				method: 'POST',
				body: JSON.stringify({
					email,
					password,
				}),
				headers: {
					'Content-type': 'application/json; charset=UTF-8',
				},
			});
			const data = (await response.json()) as { token: string };
			if (response.status === 200) {
				const decoded: any = jwt_decode(data.token);
				const user: User = {
					token: data.token,
					role: decoded.role,
					id: decoded.aud,
					name: decoded.name,
				};
				localStorage.setItem('user', JSON.stringify(user));
				return {
					token: data.token,
					role: decoded.role,
					id: decoded.aud,
					name: decoded.name,
				};
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (error) {
			console.log(error.response.data);
			thunkAPI.rejectWithValue(error.response.data);
		}
	}
);

export const authSlice = createSlice({
	name: 'auth',
	initialState,

	reducers: {
		logout: (state) => {
			state.isAuthenticated = false;
			state.user = {
				token: '',
				role: '',
				id: '',
				name: '',
			};
			localStorage.removeItem('user');
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
			.addCase(attemptLogin.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(attemptLogin.fulfilled, (state, { payload }) => {
				state.isLoading = false;
				state.isAuthenticated = true;
				state.user.token = payload?.token ?? '';
				state.user.id = payload?.id ?? '';
				state.user.role = payload?.role ?? '';
				state.user.name = payload?.name ?? '';
				state.error = {
					status: null,
					message: '',
				};
			})
			.addCase(attemptLogin.rejected, (state, { payload }: any) => {
				state.isLoading = false;
				state.error = payload;
			});
	},
});

export const { logout, clearError } = authSlice.actions;

export const authState = (state: RootState) => state.auth;

export default authSlice.reducer;
