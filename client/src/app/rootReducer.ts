import storage from 'redux-persist/lib/storage';
import { AnyAction, Reducer, combineReducers } from '@reduxjs/toolkit';

//reducers
import drawerReducer from '../features/drawer/drawerSlice';
import tabsReducer from '../features/tabs/tabsSlice';
import groupsReducer from '../features/groups/groupsSlice';
import studentReducer from '../features/students/studentsSlice';
import unitsReducer from '../features/units/unitsSlice';
import modalReducer from '../features/modal/modalSlice';
import authReducer from '../features/auth/authSlice';
import equipmentReducer from '../features/equipment/equipmentSlice';
import profileReducer from '../features/profile/profileSlice';
import practicalsReducer from '../features/practicals/practicalSlice';
import componentsReducer from '../features/equipment/componentsSlice';
import reportsReducer from '../features/reports/reportsSlice';

//combine reducers
const appReducer = combineReducers({
	drawer: drawerReducer,
	tabs: tabsReducer,
	groups: groupsReducer,
	students: studentReducer,
	units: unitsReducer,
	modal: modalReducer,
	auth: authReducer,
	equipments: equipmentReducer,
	profile: profileReducer,
	practicals: practicalsReducer,
	components: componentsReducer,
	reports: reportsReducer,
});

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
	if (action.type === 'auth/logout') {
		storage.removeItem('persist:root');
		state = {} as RootState;
	}
	return appReducer(state, action);
};

export default rootReducer;
export type RootState = ReturnType<typeof appReducer>;
