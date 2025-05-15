import config from '@essential/builder/config';
import { IProject, ISetTheme } from '../../entities/projects/project.item';

export class ProjectItemProvider {
	publish = async (params: IProject) => {
		const url = `${config.params.server}/project`;
		const response = await fetch(url, {
			body: JSON.stringify(params),
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();

		return data;
	};

	getThemeTemplates = async (params: { id: string }) => {
		const url = `${config.params.server}/project/themes/template/${params.id}`;
		const response = await fetch(url, {
			method: 'GET',
		});
		const data = await response.blob();
		return data;
	};

	load = async (params: { id: string }) => {
		const url = `${config.params.server}/project/${params.id}`;
		const response = await fetch(url, {
			method: 'GET',
		});
		const data = await response.json();

		if (!data.status) return data;
		return data.data;
	};

	setTheme = async (params: ISetTheme) => {
		const url = `${config.params.server}/project/${params.id}/theme/variables`;
		const response = await fetch(url, {
			body: JSON.stringify(params),
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();

		return data;
	};
}
