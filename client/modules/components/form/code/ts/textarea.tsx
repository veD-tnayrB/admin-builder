import { Textarea as BaseTextarea } from 'pragmate-ui/form';

export interface IProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	ref?: any;
	errorMessage?: string;
	max?: string;
	lengthMessage?: string;
	hasError?: boolean;
	label?: string;
	value?: string;
	counter?: boolean;
	children?: React.ReactNode;
	variant?: string;
	floating?: boolean;
	info?: string;
}

import React from 'react';
import { Descriptor } from './descriptor';

export /*bundle*/ const Textarea = (props: IProps) => {
	return (
		<div className="custom-textarea">
			<BaseTextarea {...props} />

			{props.info && <Descriptor value={props.info} />}
		</div>
	);
};
