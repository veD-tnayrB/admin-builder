import { Item } from '@beyond-js/reactive/entities/item';
import { ProjectItemProvider } from '../../providers/projects/project.item.provider';

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
			],
			entity: 'projects',
		});
	}
}
