export interface ITexts {
	downloadTemplate: string;
	labels: {
		light: {
			value: string;
			info: string;
			placeholder: string;
		};
		dark: {
			value: string;
			info: string;
			placeholder: string;
		};
	};
	modals: {
		reset: {
			title: string;
			description: string;
			actions: {
				cancel: string;
				confirm: string;
			};
		};
	};
	actions: {
		save: string;
		back: string;
		reset: string;
	};
	errors: {
		somethingWentWrong: string;
		missingDark: string;
		missingLight: string;
	};
	success: string;
}

export interface IValues {
	dark: string;
	light: string;
}
