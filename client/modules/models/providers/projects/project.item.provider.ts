import config from '@essential/builder/config';
import { IProject } from '../../entities/projects/project.item';

export class ProjectItemProvider {
	publish = async (params: IProject) => {
		const url = `${config.params.server}/setup`;
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
