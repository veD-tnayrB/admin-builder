import { useBinder } from '@beyond-js/react-18-widgets/hooks';
import { MainHeader } from '@essential/builder/components/main-header';
import { Alert } from 'pragmate-ui/alert';
import * as React from 'react';
import { IContext, VariablesSetupContext } from '../context';
import { StoreManager } from '../store';
import { Form } from './form';
import { ResetModal } from './reset-modal';
import { SyntaxErrors } from './syntax-errors';

export /*bundle*/
function View({ store }: { store: StoreManager }): JSX.Element {
	const [, setUpdate] = React.useState({});
	useBinder([store], () => setUpdate({}));

	const onToggleResetModal = () => {
		store.resetModal = !store.resetModal;
	};

	if (!store.isReady) return null;

	const contextValue: IContext = {
		store,
		onToggleResetModal,
	};
	return (
		<VariablesSetupContext.Provider value={contextValue}>
			<div className="page-container managment-page">
				<MainHeader />

				{store.success && (
					<Alert type="success" message={store.success} />
				)}
				{store.error && <Alert type="error" message={store.error} />}
				<SyntaxErrors />
				<Form />
				{store.resetModal && <ResetModal />}
			</div>
		</VariablesSetupContext.Provider>
	);
}
