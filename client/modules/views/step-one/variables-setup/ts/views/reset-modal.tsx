import { ConfirmModal } from '@essential/builder/components/modal';
import React from 'react';
import { useSetupContext } from '../context';

export const ResetModal = () => {
	const { store, onToggleResetModal } = useSetupContext();

	const modal = store.texts.modals.reset;
	const options = {
		title: modal.title,
		description: modal.description,
		close: {
			onClick: onToggleResetModal,
			label: modal.actions.cancel,
		},
		confirm: {
			onClick: () => {
				store.reset();
				onToggleResetModal();
			},
			label: modal.actions.confirm,
		},
	};
	return <ConfirmModal {...options} />;
};
