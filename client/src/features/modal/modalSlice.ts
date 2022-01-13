import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

export interface ModalState {
	isOpen: boolean;
	file: string;
}

const initialState: ModalState = {
	isOpen: false,
	file: '',
};

export const modalSlice = createSlice({
	name: 'modal',
	initialState,
	reducers: {
		setIsOpen: (state, action: PayloadAction<boolean>) => {
			state.isOpen = action.payload;
		},
		setFile: (state, action: PayloadAction<string>) => {
			state.file = action.payload;
		},
	},
});

export const { setIsOpen, setFile } = modalSlice.actions;

export const modalState = (state: RootState) => state.modal;

export default modalSlice.reducer;
