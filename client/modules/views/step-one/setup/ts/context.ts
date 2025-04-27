import React from 'react';
import { StoreManager } from './store';

export interface IContext {
	store: StoreManager;
	onToggleResetModal: () => void;
	onToggleSuccessModal: () => void;
}

export const SetupContext = React.createContext({} as IContext);
export const useSetupContext = () => React.useContext(SetupContext);
