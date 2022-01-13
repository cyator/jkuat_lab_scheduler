import React from 'react';
import { TextField } from '@material-ui/core';
import { useController, UseControllerProps } from 'react-hook-form';
import { FormData } from '../../../Pages/Login';

function Input({ name, control }: UseControllerProps<FormData>) {
	const {
		field: { ref, ...inputProps },
		fieldState: { error },
	} = useController({
		name,
		control,
	});

	return (
		<TextField
			{...inputProps}
			variant="outlined"
			required
			id={name}
			label={name}
			margin="dense"
			fullWidth
			inputRef={ref}
			error={error ? true : false}
			helperText={
				error?.message ?? `please type in the ${name} of the practical`
			}
		/>
	);
}

export default Input;
