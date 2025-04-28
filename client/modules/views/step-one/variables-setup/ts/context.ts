import React from 'react';
import { StoreManager } from './store';

export interface IContext {
	store: StoreManager;
	onToggleResetModal: () => void;
}

export const VariablesSetupContext = React.createContext({} as IContext);
export const useVariablesSetupContext = () =>
	React.useContext(VariablesSetupContext);
