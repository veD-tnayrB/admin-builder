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

		try {
			const content = await this.read(file);
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

	writeThemeVariable = async (outputDir: string, content: string) => {
		const file = join(outputDir);

		try {
			await fs.writeFile(file, content, 'utf8');
			return { status: true };
		} catch (error) {
			return { status: false, error };
		}
	};

	validateThemeVariables = (scssContent: string) => {
		// Normalize line endings and trim
		const content = scssContent.replace(/\r\n/g, '\n').trim();

		// Step 1: Find the start of the mixin
		const mixinStart = content.indexOf('@mixin properties()');
		if (mixinStart === -1) {
			return {
				status: false,
				error: 'Missing @mixin properties() declaration',
			};
		}

		// Step 2: Ensure nothing significant before the mixin start (allow only whitespace/comments)
		const beforeMixin = content.slice(0, mixinStart).trim();
		if (beforeMixin.length > 0) {
			return {
				status: false,
				error: 'Unexpected content before @mixin properties()',
				details: beforeMixin,
			};
		}

		// Step 3: Extract the mixin block content by matching braces
		// Find opening brace '{' after mixin declaration
		const braceOpenIndex = content.indexOf('{', mixinStart);
		if (braceOpenIndex === -1) {
			return {
				status: false,
				error: 'Opening brace "{" not found after @mixin properties()',
			};
		}

		// Find matching closing brace '}' for the mixin block
		let braceCount = 1;
		let i = braceOpenIndex + 1;
		for (; i < content.length; i++) {
			if (content[i] === '{') braceCount++;
			else if (content[i] === '}') braceCount--;

			if (braceCount === 0) break;
		}

		if (braceCount !== 0) {
			return {
				status: false,
				error: 'Unbalanced braces in @mixin properties() block',
			};
		}

		const mixinBody = content.slice(braceOpenIndex + 1, i).trim();

		// Split lines and validate each line
		const lines = mixinBody.split(/\r?\n/);

		// Regex to validate CSS custom property line:
		// - Starts with optional whitespace
		// - Then --variable-name (letters, digits, dashes)
		// - Colon :
		// - Value (anything except newline, ending with ;)
		// - Or a comment line starting with //
		const validLineRegex = /^\s*(--[\w-]+:\s*[^;]+;\s*|\/\/.*)?$/;

		// Collect invalid lines with line numbers
		const invalidLines = lines
			.map((line, idx) => ({ line: line.trim(), idx: idx + 1 }))
			.filter(
				({ line }) => line.length > 0 && !validLineRegex.test(line)
			);

		if (invalidLines.length > 0) {
			return {
				status: false,
				error: invalidLines,
			};
		}

		return {
			status: true,
		};
	};
}
