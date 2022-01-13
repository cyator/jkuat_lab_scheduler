import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface tabsState {
	value: number;
}

const initialState: tabsState = {
	value: 0,
};

export const tabsSlice = createSlice({
	name: 'tabs',
	initialState,
	reducers: {
		setValue: (state, action: PayloadAction<number>) => {
			state.value = action.payload;
		},
	},
});

export const { setValue } = tabsSlice.actions;

export const tabValue = (state: RootState) => state.tabs.value;

export default tabsSlice.reducer;
