import { useBinder } from '@beyond-js/react-18-widgets/hooks';
import { MainHeader } from '@essential/builder/components/main-header';
import { Alert } from 'pragmate-ui/alert';
import * as React from 'react';
import { IContext, SetupContext } from '../context';
import { StoreManager } from '../store';
import { Form } from './form';
import { ResetModal } from './reset-modal';

export /*bundle*/
function View({ store }: { store: StoreManager }): JSX.Element {
	const [, setUpdate] = React.useState({});

	useBinder([store], () => setUpdate({}));

	const onToggleResetModal = () => {
		store.resetModal = !store.resetModal;
	};

	const onToggleSuccessModal = () => {
		store.successModal = !store.successModal;
	};

	const contextValue: IContext = {
		store,
		onToggleResetModal,
		onToggleSuccessModal,
	};
	return (
		<SetupContext.Provider value={contextValue}>
			<div className="page-container managment-page">
				<MainHeader />

				{store.success && (
					<Alert type="success" message={store.success} />
				)}
				{store.error && <Alert type="error" message={store.error} />}
				<Form />
				{store.resetModal && <ResetModal />}
			</div>
		</SetupContext.Provider>
	);
}
