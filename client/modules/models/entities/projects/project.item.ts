import { Item } from '@beyond-js/reactive/entities/item';
import { ProjectItemProvider } from '../../providers/projects/project.item.provider';
import { ThemePalette } from './theme-palette';

export interface IVariables {
	dark: ThemePalette;
	light: ThemePalette;
}

export interface ISetTheme extends IVariables {
	id: string;
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
	constructor(parent: any = {}) {
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

	setTheme = (params: ISetTheme) => {
		return this.provider.setTheme(params);
	};
}
