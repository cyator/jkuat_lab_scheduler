import React, { ChangeEvent } from 'react';
import { TextField } from '@material-ui/core';
import { useController, UseControllerProps } from 'react-hook-form';
import { FormData } from './AddPractical';

function FileInput({ name, control }: UseControllerProps<FormData>) {
	const {
		field: { ref, onChange, value, ...inputProps },
		fieldState: { error },
	} = useController({
		name,
		control,
	});

	return (
		<TextField
			{...inputProps}
			id={name}
			type="file"
			label={name}
			margin="dense"
			fullWidth
			inputRef={ref}
			onChange={(event: ChangeEvent<HTMLInputElement>) =>
				onChange(event.target.files)
			}
			error={error ? true : false}
			helperText={error?.message ?? `choose a pdf of the ${name}`}
		/>
	);
}

export default FileInput;
