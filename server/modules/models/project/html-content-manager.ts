import { promises as fs } from 'fs';
import { JSDOM } from 'jsdom';
import type { Project } from './project';

export class HTMLContentManager {
	private parent: Project;

	constructor(parent: Project) {
		this.parent = parent;
	}

	updateIndexHtml = async (indexHtmlPath: string) => {
		try {
			// 1. Read HTML
			const htmlContent = await fs.readFile(indexHtmlPath, 'utf-8');

			// 2. Parse HTML with JSDOM
			const dom = new JSDOM(htmlContent);
			const { document } = dom.window;

			// 3. Modify Meta Tags
			this.setMetaContent(
				document,
				'description',
				this.parent.description
			);
			this.setMetaContent(document, 'keywords', this.parent.keywords);
			this.setMetaContent(document, 'author', this.parent.author);
			this.setMetaProperty(
				document,
				'og:description',
				this.parent.description
			);
			this.setMetaProperty(document, 'og:title', this.parent.title);
			this.setMetaContent(
				document,
				'twitter:description',
				this.parent.description
			);
			this.setMetaContent(document, 'twitter:title', this.parent.title);
			this.updateTitleTag(document);

			// 4. Serialize Modified HTML
			const updatedHtml = dom.serialize();

			// 5. Write Changes
			await fs.writeFile(indexHtmlPath, updatedHtml, 'utf-8');
			console.log('index.html updated successfully');
			return { status: true };
		} catch (error) {
			console.error('Failed to update index.html:', error);
			return { status: false, error };
		}
	};

	/**
	 * Helper function to set content attribute for meta tags
	 * @param document JSDOM document instance
	 * @param name Meta tag 'name' attribute value
	 * @param content Content string to set
	 */
	private setMetaContent = (
		document: Document,
		name: string,
		content: string
	): void => {
		const metaTag = document.querySelector(`meta[name="${name}"]`);
		if (metaTag) {
			metaTag.setAttribute('content', content);
		}
	};

	/**
	 * Helper function to set content attribute for meta property tags
	 * @param document JSDOM document instance
	 * @param property Meta tag 'property' attribute value
	 * @param content Content string to set
	 */
	private setMetaProperty = (
		document: Document,
		property: string,
		content: string
	): void => {
		const metaTag = document.querySelector(`meta[property="${property}"]`);
		if (metaTag) {
			metaTag.setAttribute('content', content);
		}
	};

	private updateTitleTag = (document: Document): void => {
		const titleElement = document.querySelector('title');
		if (titleElement && this.parent.title) {
			titleElement.textContent = this.parent.title;
		}
	};
}
