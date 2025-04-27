import { RepoManager } from '@essential/server/helpers';
import * as fs from 'fs';
import { HTMLContentManager } from './html-content-manager';
import { JSONContentManager } from './json-content-manager';

export /*bundle*/ interface IProject {
	id: string;
	name: string;
	subName: string;
	scope: string;
	description: string;
	author: string;
	keywords: string;
	title: string;
}

export /*bundle*/ class Project {
	id: string = '';
	name: string = '';
	subName: string = '';
	scope: string = '';
	description: string = '';
	author: string = '';
	keywords: string = '';
	title: string = '';
	#htmlContentManager: HTMLContentManager;
	#jsonContentManager: JSONContentManager;
	#outputDir: string;

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

	constructor(values: IProject) {
		this.id = values.id;
		this.name = values.name;
		this.subName = values.subName;
		this.scope = values.scope;
		this.description = values.description;
		this.author = values.author;
		this.keywords = values.keywords;
		this.title = values.title;

		this.#htmlContentManager = new HTMLContentManager(this);
		this.#jsonContentManager = new JSONContentManager(this);
	}

	initialize = async () => {
		const err = this.validate();
		if (err) {
			return { status: false, error: err };
		}

		const outputDir = `./instances/${this.id}`;
		this.#outputDir = outputDir;
		await fs.promises.mkdir('./instances', { recursive: true });
		await fs.promises.mkdir(`./instances/${this.id}`, { recursive: true });
		const clone = await RepoManager.clone(outputDir);
		if (!clone.status) return clone;

		const parameterRes = await this.setParameters();
		if (!parameterRes.status) return parameterRes;

		const projectName = this.scope.replace('@', '');
		const publishRes = await RepoManager.setupRepo(
			projectName,
			this.description,
			outputDir
		);
		if (!publishRes.status) return publishRes;
		await fs.promises.rm(outputDir, { recursive: true, force: true });

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
		const indexHTMLPath = `${this.#outputDir}/client/index.html`;
		const indexHTMLRes = await this.#htmlContentManager.updateIndexHtml(
			indexHTMLPath
		);
		if (!indexHTMLRes.status) return indexHTMLRes;

		const configPath = `${this.#outputDir}/client/package.json`;
		const configRes = await this.#jsonContentManager.updateConfig(
			configPath
		);
		if (!configRes.status) return configRes;

		return { status: true };
	};
}
