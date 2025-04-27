import { MultilanguageStore } from '@essential/builder/helpers';
import { Project } from '@essential/builder/models';
import { module } from 'beyond_context';
import { v4 as uuid } from 'uuid';
import { ITexts, IValues } from './types';

export class StoreManager extends MultilanguageStore<StoreManager, ITexts> {
	isStore: boolean = true;

	#item: Project = new Project();
	get item() {
		return this.#item;
	}

	#values: IValues = {
		name: '',
		subName: '',
		scope: '',
		description: '',
		author: '',
		keywords: '',
		title: '',
	};
	get values() {
		return this.#values;
	}

	success: string = '';
	error: string = '';

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

	load = (projectId: string) => {
		try {
			if (!projectId) {
				this.#projectId = uuid();
				window.history.replaceState(
					{},
					'',
					window.location.pathname + '?projectId=' + this.#projectId
				);
				return;
			}
			this.#projectId = projectId;
			// TODO: Bryant please make the load when the projectId is generated, im too tired for do it right now
		} catch (error) {
			console.error(error);
		}
	};

	save = async () => {
		try {
			this.fetching = true;
			this.error = '';
			this.triggerEvent();
			const err = this.checkErrors();
			if (err) {
				this.error = err;
				this.triggerEvent();
				return;
			}

			const params = { ...this.#values, id: this.#projectId };
			await this.#item.set(params);
			// const response = await this.#item.publish(params);
			console.log(this.texts.success);
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
		if (!values.name) return errors.missingName;
		if (values.subName.split(' ').length > 1) return errors.invalidSubName;
		const invalidScope = !/^@[a-z][a-z0-9]*$/.test(values.scope);
		if (invalidScope) return errors.invalidScope;
		if (!values.title) return errors.missingTitle;
		if (!values.author) return errors.missingAuthor;
		if (!values.keywords) return errors.missingKeywords;
		const keywordRegex = /^[a-zA-Z0-9ñÑ\s]+(,\s*[a-zA-Z0-9ñÑ\s]+)*$/;
		const invalidKeywords = !keywordRegex.test(values.keywords);

		// Agrega validación de campo vacío primero
		if (!values.keywords.trim()) return errors.missingKeywords;
		if (invalidKeywords) return errors.invalidKeywords;
		return '';
	};

	reset = () => {
		this.#values = {
			name: '',
			subName: '',
			scope: '',
			description: '',
			author: '',
			keywords: '',
			title: '',
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
}
