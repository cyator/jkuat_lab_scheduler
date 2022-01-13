import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface DrawerState {
	isOpen: boolean;
}

const initialState: DrawerState = {
	isOpen: false,
};

export const drawerSlice = createSlice({
	name: 'drawer',
	initialState,

	reducers: {
		open: (state) => {
			state.isOpen = true;
		},
		close: (state) => {
			state.isOpen = false;
		},
	},
});

export const { open, close } = drawerSlice.actions;

export const drawerState = (state: RootState) => state.drawer;

export default drawerSlice.reducer;
