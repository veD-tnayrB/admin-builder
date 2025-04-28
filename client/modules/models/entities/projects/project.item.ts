import { Item } from '@beyond-js/reactive/entities/item';
import { ProjectItemProvider } from '../../providers/projects/project.item.provider';
import {
	IThemePalette,
	REQUIRED_VARIABLES,
	ThemePalette,
} from './theme-palette';

interface IVariables {
	dark: ThemePalette;
	light: ThemePalette;
}

export /*bundle*/ interface IProject {
	id: string;
	name: string;
	subName: string;
	scope: string;
	description: string;
	author: string;
	keywords: string;
	title: string;
	variables: IVariables;
}

export /*bundle*/ class Project extends Item<IProject> {
	constructor(parent: any) {
		super({
			// @ts-ignore
			provider: ProjectItemProvider,
			properties: [
				'id',
				'name',
				'subName',
				'scope',
				'description',
				'author',
				'keywords',
				'title',
				'variables',
			],
			entity: 'projects',
		});
	}

	getThemeTemplates = async () => {
		try {
			const res = await this.provider.getThemeTemplates({
				id: this.id,
			});
			const url = window.URL.createObjectURL(res);

			const a = document.createElement('a');
			a.href = url;
			a.download = 'themes.scss';
			document.body.appendChild(a);
			a.click();
			a.remove();
			return { status: true };
		} catch (error) {
			return { status: false, error };
		}
	};

	checkVariables = () => {
		console.log('check variables', this.variables);

		Object.entries(this.variables).find(
			([_, val]: [string, IThemePalette]) => {
				const res = this.checkVariableGroup(val);
				console.log('res: ', res);
			}
		);
	};

	checkVariableGroup = (obj: IThemePalette) => {
		const errors: string[] = [];
		console.log('check variagble group: ', obj);
		console.log('required variables: ', REQUIRED_VARIABLES);

		// 1. Check missing keys
		const missingKeys = REQUIRED_VARIABLES.filter(key => !(key in obj));
		if (missingKeys.length > 0) {
			errors.push(`Missing keys: ${missingKeys.join(', ')}`);
		}

		// 2. Validate hex colors (excluding special cases)
		const hexColorRegex = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
		const nonHexKeys = new Set<keyof ThemePalette>([
			'primaryShadow',
			'secondaryShadow',
			'modalBackgroundColor',
		]);

		for (const key in obj) {
			// Skip validation for non-hex keys
			if (nonHexKeys.has(key as keyof ThemePalette)) continue;

			// Validate hex format
			if (!obj[key] || !hexColorRegex.test(obj[key])) {
				errors.push(`Invalid hex format for ${key}: ${obj[key]}`);
			}
		}

		return errors.length === 0 ? { valid: true } : { valid: false, errors };
	};
}
