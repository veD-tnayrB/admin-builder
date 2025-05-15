import { Alert } from 'pragmate-ui/alert';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { useVariablesSetupContext } from '../context';

export const SyntaxErrors = () => {
	const { store } = useVariablesSetupContext();

	if (!store.syntaxError.errors.length) return null;

	const messages = store.syntaxError.errors.map(err => {
		return <span key={uuid()}>{err.line}</span>;
	});
	return (
		<Alert type="error" className="d-flex flex-col">
			{store.syntaxError.theme}:{messages}
		</Alert>
	);
};
