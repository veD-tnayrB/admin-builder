import { routing } from '@beyond-js/kernel/routing';
import { MultilanguageStore } from '@essential/builder/helpers';
import { Project } from '@essential/builder/models';
import { module } from 'beyond_context';
import { ITexts, IValues } from './types';

export class StoreManager extends MultilanguageStore<StoreManager, ITexts> {
	isStore: boolean = true;

	#item: Project = new Project();
	get item() {
		return this.#item;
	}

	#values: IValues = {
		dark: '',
		light: '',
	};
	get values() {
		return this.#values;
	}

	success: string = '';
	error: string = '';
	syntaxError: {
		theme: 'dark' | 'light';
		errors: { line: string; idx: string }[];
	} = { theme: 'dark', errors: [] };

	#resetModal: boolean = false;
	get resetModal() {
		return this.#resetModal;
	}

	set resetModal(value: boolean) {
		this.#resetModal = value;
		this.triggerEvent();
	}

	#successModal: boolean = false;
	get successModal() {
		return this.#successModal;
	}

	set successModal(value: boolean) {
		this.#successModal = value;
		this.triggerEvent();
	}

	#projectId: string = '';

	constructor() {
		super(module.specifier);
	}

	load = async (projectId: string) => {
		try {
			this.ready = false;

			if (!projectId) {
				routing.pushState('/');
				return;
			}

			this.#projectId = projectId;
			await this.#item.set({ id: this.#projectId });
			const response = await this.#item.load({ id: this.#projectId });
			if (!response.status && response.error === 'NOT_FOUND') {
				routing.pushState('/');
				return;
			}
			console.log('response  ', response);
			console.log('item:', this.#item);
			this.#values = this.#item.variables;
			console.log('vals: ', this.#values);
			this.triggerEvent();
		} catch (error) {
			console.error(error);
		} finally {
			this.ready = true;
		}
	};

	save = async () => {
		try {
			this.fetching = true;
			this.error = '';
			this.success = '';
			this.syntaxError = { theme: 'dark', errors: [] };
			this.triggerEvent();
			const params = { variables: this.#values, id: this.#projectId };
			console.log('params: ', params);
			await this.#item.set(params);
			const err = this.checkErrors();
			if (err) {
				this.error = err;
				this.triggerEvent();
				return;
			}

			const response = await this.#item.setTheme(params);

			console.log('res: ', response);
			if (!response.status) {
				if (
					response.error.hasOwnProperty('dark') ||
					response.error.hasOwnProperty('light')
				) {
					if (typeof response.error.dark === 'string') {
						this.error = response.error.dark;
						return;
					}
					if (typeof response.error.light === 'string') {
						this.error = response.error.light;
						return;
					}

					if (
						Array.isArray(response.error.dark) &&
						response.error.dark.length
					) {
						this.error = '';
						this.syntaxError = {
							theme: 'dark',
							errors: response.error.dark,
						};

						this.triggerEvent();
						console.log('this.syntax error: ', this.syntaxError);
					}

					if (
						Array.isArray(response.error.light) &&
						response.error.light.length
					) {
						this.error = '';
						this.syntaxError = {
							theme: 'light',
							errors: response.error.light,
						};
						this.triggerEvent();
					}

					return;
				}

				this.error = response.error;
				return;
			}

			this.success = this.texts.success;
			this.triggerEvent();
		} catch (error) {
			console.error(error);
			this.error = this.texts.errors.somethingWentWrong;
			this.triggerEvent();
		} finally {
			this.fetching = false;
		}
	};

	checkErrors = () => {
		const values = this.#values;
		const errors = this.texts.errors;
		if (!values.dark) return errors.missingDark;
		if (!values.light) return errors.missingLight;
		return '';
	};

	reset = () => {
		this.#values = {
			dark: '',
			light: '',
		};

		this.triggerEvent();
	};

	onChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = event.target;
		this.#values = { ...this.#values, [name]: value };
		this.triggerEvent();
	};

	downloadTemplate = async () => {
		try {
			const res = await this.#item.getThemeTemplates({
				id: this.#projectId,
			});
			console.log('downlooad template: ', res);
		} catch (error) {
			this.error = error;
			console.error(error);
		}
	};
}
