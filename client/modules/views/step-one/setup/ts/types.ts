export interface ITexts {
	title: string;
	labels: {
		name: {
			value: string;
			info: string;
			placeholder: string;
		};
		subName: {
			value: string;
			info: string;
			placeholder: string;
		};
		scope: {
			value: string;
			info: string;
			placeholder: string;
		};
		title: {
			value: string;
			info: string;
			placeholder: string;
		};
		description: {
			value: string;
			info: string;
			placeholder: string;
		};
		author: {
			value: string;
			info: string;
			placeholder: string;
		};
		keywords: {
			value: string;
			info: string;
			placeholder: string;
		};
	};
	actions: {
		save: string;
		reset: string;
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
	errors: {
		missingName: string;
		invalidSubName: string;
		invalidScope: string;
		missingTitle: string;
		missingAuthor: string;
		missingKeywords: string;
		invalidKeywords: string;
		somethingWentWrong: string;
	};
	success: string;
}

export interface IValues {
	name: string;
	subName: string;
	scope: string;
	description: string;
	author: string;
	keywords: string;
	title: string;
}
