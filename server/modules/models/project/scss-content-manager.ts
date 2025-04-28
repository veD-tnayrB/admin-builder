import { promises as fs } from 'fs';
import { join } from 'path';

export class ScssContentManager {
	read = async (scssFilePath: string) => {
		const content = await fs.readFile(scssFilePath, 'utf8');
		return content;
	};

	getThemeVariables = async (outputDir: string) => {
		const file = join(
			outputDir,
			'client/template/application/custom-properties/_light.scss'
		);
		console.log('file: ', file);

		try {
			const content = await this.read(file);
			console.log('content: ', content);

			return {
				status: true,
				data: { file: content },
			};
		} catch (error) {
			console.error('Theme retrieval failed:', error);
			return {
				status: false,
				error,
			};
		}
	};
}
