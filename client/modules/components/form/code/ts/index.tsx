import { Input as BaseInput } from 'pragmate-ui/form';
import React from 'react';
import { Descriptor } from './descriptor';

export interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
	ref?: any;
	variant?: string;
	icon?: string;
	errorMessage?: string;
	value?: string;
	label?: any;
	children?: React.ReactNode;
	hasError?: boolean;
	password?: boolean;
	info?: string;
}
export /*bundle*/ const Input = (props: IProps) => {
	return (
		<div className="custom-input">
			<BaseInput {...props} />
			{props.info && <Descriptor value={props.info} />}
		</div>
	);
};
