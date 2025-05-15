import { RepoManager } from '@essential/server/helpers';
import * as fs from 'fs';
import { HTMLContentManager } from './html-content-manager';
import { JSONContentManager } from './json-content-manager';
import { ScssContentManager } from './scss-content-manager';
import { IProject, IThemes } from './types';

export /*bundle*/ class Project {
	id: string = '';
	name: string = '';
	subName: string = '';
	scope: string = '';
	description: string = '';
	author: string = '';
	keywords: string = '';
	title: string = '';
	variables: IThemes = {
		dark: '',
		light: '',
	};
	repoUrl: string = '';
	outputDir: string;
	#htmlContentManager: HTMLContentManager;
	#jsonContentManager: JSONContentManager;
	#scssContentManager: ScssContentManager;

	#errors = {
		missingName: 'MISSING_NAME',
		invalidSubName: 'INVALID_SUB_NAME',
		invalidScope: 'INVALID_SCOPE',
		missingTitle: 'MISSING_TITLE',
		missingAuthor: 'MISSING_AUTHOR',
		missingKeywords: 'MISSING_KEYWORDS',
		invalidKeywords: 'INVALID_KEYWORDS',
		somethingWentWrong: 'SOMETHING_WENT_WRONG',
	};

	constructor(values?: IProject) {
		if (values) {
			this.id = values.id;
			this.name = values.name;
			this.subName = values.subName;
			this.scope = values.scope;
			this.description = values.description;
			this.author = values.author;
			this.keywords = values.keywords;
			this.title = values.title;
			this.repoUrl = values.repoUrl;
		}

		this.#htmlContentManager = new HTMLContentManager(this);
		this.#jsonContentManager = new JSONContentManager(this);
		this.#scssContentManager = new ScssContentManager();
	}

	setup = async () => {
		const err = this.validate();
		if (err) {
			return { status: false, error: err };
		}

		const outputDir = `./instances/${this.id}`;
		this.outputDir = outputDir;

		// Load the element and apply changes if the user needs and the proyect exsists
		const configFilePath = `./instances/${this.id}/config.json`;
		const content = await this.#jsonContentManager.read(configFilePath);

		if (content) {
			this.load(this.id);
			return {
				status: true,
				data: { id: this.id, repo: content.repoUrl },
			};
		}

		console.log(`Initializing project: ${this.id}`);
		await fs.promises.mkdir('./instances', { recursive: true });
		await fs.promises.mkdir(this.outputDir, { recursive: true });
		console.log('Clonning base repo...');
		const clone = await RepoManager.clone(outputDir);
		if (!clone.status) return clone;

		console.log('Setting initial parametters...');
		const parameterRes = await this.setParameters();
		if (!parameterRes.status) return parameterRes;

		const projectName = this.scope.replace('@', '');

		console.log('Publishing repo...');
		const publishRes = await RepoManager.setupRepo(
			projectName,
			this.description,
			outputDir
		);
		if (!publishRes.status) return publishRes;
		this.repoUrl = publishRes.repoUrl;

		console.log('Saving changes...');
		await this.saveChanges();
		return {
			status: true,
			data: { id: this.id, repo: publishRes.repoUrl },
		};
	};

	validate = () => {
		const errors = this.#errors;
		if (!this.name) return errors.missingName;
		if (this.subName.split(' ').length > 1) return errors.invalidSubName;
		const invalidScope = !/^@[a-z][a-z0-9]*$/.test(this.scope);
		if (invalidScope) return errors.invalidScope;
		if (!this.title) return errors.missingTitle;
		if (!this.author) return errors.missingAuthor;
		if (!this.keywords) return errors.missingKeywords;
		const keywordRegex = /^[a-zA-Z0-9ñÑ\s]+(,\s*[a-zA-Z0-9ñÑ\s]+)*$/;
		const invalidKeywords = !keywordRegex.test(this.keywords);
		if (!this.keywords.trim()) return errors.missingKeywords;
		if (invalidKeywords) return errors.invalidKeywords;
		return '';
	};

	setParameters = async () => {
		const indexHTMLPath = `${this.outputDir}/client/index.html`;
		const indexHTMLRes = await this.#htmlContentManager.updateIndexHtml(
			indexHTMLPath
		);
		if (!indexHTMLRes.status) return indexHTMLRes;

		const configPath = `${this.outputDir}/client/package.json`;
		const configRes = await this.#jsonContentManager.updateConfig(
			configPath
		);
		if (!configRes.status) return configRes;

		return { status: true };
	};

	getThemeVariables = async () => {
		return this.#scssContentManager.getThemeVariables(this.outputDir);
	};

	saveChanges = async () => {
		const outputFile = `${this.outputDir}/config.json`;
		await this.#jsonContentManager.write(outputFile, this);
		console.log(`changes saved in ${outputFile}`);
	};

	load = async (id: string) => {
		if (!id) return { status: false, error: 'ID_REQUIRED' };
		this.outputDir = `./instances/${id}`;
		const configFilePath = `${this.outputDir}/config.json`;

		const content = await this.#jsonContentManager.read(configFilePath);
		if (!content) return { status: false, error: 'NOT_FOUND' };
		this.id = content.id;
		this.name = content.name;
		this.subName = content.subName;
		this.scope = content.scope;
		this.description = content.description;
		this.author = content.author;
		this.keywords = content.keywords;
		this.title = content.title;
		this.repoUrl = content.repoUrl;
		this.outputDir = content.outputDir;
		this.variables = content.variables;
		console.log(`content loaded for: ${id}`);

		delete content.outputDir;
		return { status: true, data: content };
	};

	remove = async () => {
		return fs.promises.rm(this.outputDir, { recursive: true, force: true });
	};

	setTheme = (variables: { dark: string; light: string }) => {
		console.log('set themes: ', variables);
		if (!variables.dark) throw 'DARK_THEME_VARIABLES_REQUIRED';
		if (!variables.light) throw 'LIGHT_THEME_VARIABLES_REQUIRED';

		const errors: {
			dark: string | { line: string; idx: number }[];
			light: string | { line: string; idx: number }[];
		} = {
			dark: [],
			light: [],
		};

		const isDarkOk = this.#scssContentManager.validateThemeVariables(
			variables.dark
		);
		if (!isDarkOk.status && isDarkOk.error) {
			errors.dark = isDarkOk.error;
		}

		const isLightOk = this.#scssContentManager.validateThemeVariables(
			variables.light
		);
		if (!isLightOk.status && isLightOk.error) {
			errors.light = isLightOk.error;
		}

		if (!isLightOk.status || !isDarkOk.status) {
			return { status: false, error: errors };
		}

		const lightThemePath = `${this.outputDir}/client/template/application/custom-properties/_light.scss`;
		const darkThemePath = `${this.outputDir}/client/template/application/custom-properties/_dark.scss`;

		this.#scssContentManager.writeThemeVariable(
			lightThemePath,
			variables.light
		);

		this.#scssContentManager.writeThemeVariable(
			darkThemePath,
			variables.dark
		);
		this.variables = variables;
		this.saveChanges();

		return { status: true };
	};
}
