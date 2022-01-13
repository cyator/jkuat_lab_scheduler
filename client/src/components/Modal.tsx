import React, { ReactElement } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { setIsOpen, modalState } from '../features/modal/modalSlice';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		modal: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		paper: {
			backgroundColor: theme.palette.background.paper,
			border: '2px solid #000',
			boxShadow: theme.shadows[5],
			padding: theme.spacing(2, 4, 3),
		},
	})
);

interface Props {
	render: () => ReactElement;
}

export default function TransitionsModal({ render }: Props) {
	const classes = useStyles();
	const dispatch = useAppDispatch();
	const { isOpen } = useAppSelector(modalState);

	const handleClose = () => {
		dispatch(setIsOpen(false));
	};

	return (
		<div>
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				className={classes.modal}
				open={isOpen}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500,
				}}
			>
				<Fade in={isOpen}>{render()}</Fade>
			</Modal>
		</div>
	);
}
