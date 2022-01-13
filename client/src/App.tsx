import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ProtectedRoute from './features/auth/ProtectedRoute';
import { authState } from './features/auth/authSlice';
import { useAppSelector } from './app/hooks';

import AppDrawer from './features/drawer/AppDrawer';
import Students from './Pages/Students';
import Home from './Pages/Home';
import Equipment from './Pages/Equipment';
import Settings from './Pages/Settings';
import Practicals from './Pages/Practicals';
import AddGroup from './components/forms/groups/AddGroup';
import AddPractical from './components/forms/practicals/AddPractical';
import Login from './Pages/Login';
import Profile from './Pages/Profile';
import NotFound from './Pages/NotFound';
import Marks from './Pages/Marks';
import Reports from './Pages/Reports';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
		},
		toolbar: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'flex-end',
			padding: theme.spacing(0, 1),
			// necessary for content to be below app bar
			...theme.mixins.toolbar,
		},
		content: {
			flexGrow: 1,
			padding: theme.spacing(3),
		},
	})
);

function App() {
	const classes = useStyles();
	const { isAuthenticated } = useAppSelector(authState);

	return (
		<div className={classes.root}>
			{isAuthenticated && <AppDrawer />}
			<main className={classes.content}>
				<div className={classes.toolbar} />
				<Switch>
					<ProtectedRoute path="/" exact component={Home} />
					<ProtectedRoute path="/equipment" component={Equipment} />
					<ProtectedRoute path="/practicals" component={Practicals} />
					<ProtectedRoute path="/students" component={Students} />
					<ProtectedRoute path="/settings" component={Settings} />
					<ProtectedRoute path="/add-group" component={AddGroup} />
					<ProtectedRoute path="/add-practical" component={AddPractical} />
					<ProtectedRoute path="/profile" component={Profile} />
					<ProtectedRoute path="/marks" component={Marks} />
					<ProtectedRoute path="/reports" component={Reports} />
					<Route path="/login" component={Login} />
					<Route component={NotFound} />
				</Switch>
			</main>
			<ToastContainer
				position="bottom-center"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</div>
	);
}

export default App;
