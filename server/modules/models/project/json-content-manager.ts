import { promises as fs } from 'fs';
import type { Project } from './project';

interface IConfig {
	name: string;
	title: string;
	description: string;
	params: {
		application: {
			company: {
				name: string;
				subName: string;
			};
		};
	};
	[key: string]: any;
}

export class JSONContentManager {
	private parent: Project;

	constructor(parent: Project) {
		this.parent = parent;
	}

	/**
	 * Full config update workflow
	 * @param configPath Path to JSON config file
	 */
	async updateConfig(configPath: string) {
		try {
			const config = await this.read(configPath);
			this.applyUpdates(config);
			await this.write(configPath, config);
			console.log('package.json updated successfully');
			return { status: true };
		} catch (error) {
			console.error(`Config update failed for ${configPath}:`, error);
			return { status: false, error };
		}
	}

	/**
	 * Read and parse JSON file
	 * @param path File path
	 */
	private async read(path: string): Promise<IConfig> {
		try {
			const content = await fs.readFile(path, 'utf-8');
			return JSON.parse(content);
		} catch (error) {
			console.error(`Error reading ${path}:`, error);
			throw new Error('CONFIG_READ_ERROR');
		}
	}

	/**
	 * Apply project-specific updates to config
	 * @param config Parsed config object
	 */
	private applyUpdates(config: IConfig): void {
		const localDB = `${this.parent.scope.replace('@', '')}-backoffice`;
		const updates = {
			name: `${this.parent.scope}/backoffice`,
			title: this.parent.title,
			description: this.parent.description,
			params: {
				application: {
					localDB: localDB,
					company: {
						name: this.parent.name,
						subName: this.parent.subName,
					},
				},
			},
		};

		this.deepMerge(config, updates);
	}

	/**
	 * Recursive deep merge implementation
	 * @param target Base object to merge into
	 * @param source Source of updates
	 */
	private deepMerge(target: any, source: any): void {
		Object.keys(source).forEach(key => {
			if (source[key] instanceof Object && key in target) {
				this.deepMerge(target[key], source[key]);
			} else {
				target[key] = source[key];
			}
		});
	}

	/**
	 * Write updated config to file
	 * @param path File path
	 * @param config Updated config object
	 */
	private async write(path: string, config: IConfig): Promise<void> {
		try {
			const content = JSON.stringify(config, null, 2);
			await fs.writeFile(path, content, 'utf-8');
		} catch (error) {
			console.error(`Error writing ${path}:`, error);
			throw new Error('CONFIG_WRITE_ERROR');
		}
	}

	/**
	 * Validate config structure
	 * @param config Config object to validate
	 */
	private validate(config: IConfig): void {
		const required = ['name', 'title', 'description', 'params'];
		const missing = required.filter(field => !config[field]);
		if (missing.length) {
			throw new Error(`Missing required fields: ${missing.join(', ')}`);
		}
	}
}
