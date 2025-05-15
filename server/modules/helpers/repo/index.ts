import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export /*bundle*/ class RepoManager {
	// Cache for rate limiting
	private static queue = new Map<string, Promise<any>>();

	/**
	 * Async clone with queue management and error handling
	 */
	static clone = async (
		outputTarget: string
	): Promise<{ status: boolean; error?: string }> => {
		if (!process.env.PROJECT_REPO) {
			return { status: false, error: 'NO_PROJECT_REPO_CONFIGURED' };
		}

		const repoUrl = process.env.PROJECT_REPO;
		const cacheKey = `clone-${outputTarget}`;

		try {
			// Deduplicate concurrent requests
			if (!this.queue.has(cacheKey)) {
				this.queue.set(
					cacheKey,
					execAsync(`git clone ${repoUrl} ${outputTarget}`)
				);
			}

			await this.queue.get(cacheKey);
			return { status: true };
		} catch (error) {
			console.error(
				`Clone failed for ${outputTarget}:`,
				error.stderr || error.message
			);
			return { status: false, error: 'CLONE_FAILED' };
		} finally {
			this.queue.delete(cacheKey);
		}
	};

	/**
	 * GitHub repo creation with enhanced error handling
	 */
	static create = async (
		projectName: string,
		description: string
	): Promise<{
		status: boolean;
		cloneUrl?: string;
		repoUrl?: string;
		error?: string;
	}> => {
		const reponame = projectName.replace('@', '');
		const user = process.env.GH_USER;
		const token = process.env.GH_ACCESS_TOKEN;

		if (!user || !token) {
			return { status: false, error: 'MISSING_GH_CREDENTIALS' };
		}

		try {
			const response = await axios.post(
				`https://api.github.com/user/repos`,
				{
					name: reponame,
					private: true,
					description,
					homepage: `https://github.com/${user}/${reponame}`,
					has_issues: true,
					has_projects: false,
					has_wiki: false,
					auto_init: false,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'User-Agent': 'Node.js',
						Accept: 'application/vnd.github.v3+json',
						'X-GitHub-Api-Version': '2022-11-28',
					},
					timeout: 5000,
				}
			);

			return {
				status: true,
				cloneUrl: response.data.clone_url,
				repoUrl: response.data.html_url,
			};
		} catch (error) {
			const errorData = error.response?.data?.message || error.message;
			console.error(`Repo creation failed for ${reponame}:`, errorData);

			return {
				status: false,
				error: errorData.includes('name already exists')
					? 'REPO_EXISTS'
					: 'REPO_CREATION_FAILED',
			};
		}
	};

	/**
	 * Async push workflow with atomic operations
	 */
	static push = async (
		localDir: string,
		cloneUrl: string,
		token: string
	): Promise<{ status: boolean; error?: string }> => {
		const urlWithToken = cloneUrl.replace('https://', `https://${token}@`);
		const commands = [
			'git remote remove origin || true',
			`git remote add origin ${urlWithToken}`,
			'git branch -M main',
			'git add .',
			'git commit -m "Initial commit"',
			'git push -u origin main',
		];

		try {
			for (const cmd of commands) {
				await execAsync(cmd, { cwd: localDir });
			}
			return { status: true };
		} catch (error) {
			console.error(
				`Push failed for ${localDir}:`,
				error.stderr || error.message
			);
			return { status: false, error: 'PUSH_FAILED' };
		}
	};

	/**
	 * Full workflow helper
	 */
	static setupRepo = async (
		projectName: string,
		description: string,
		outputDir: string
	): Promise<{ status: boolean; repoUrl?: string; error?: string }> => {
		// 1. Create GitHub repo
		const creation = await this.create(projectName, description);
		if (!creation.status) {
			console.error('Error creating the repo: ', creation);
			return creation;
		}

		// 3. Push to new repo
		const push = await this.push(
			outputDir,
			creation.cloneUrl!,
			process.env.GH_ACCESS_TOKEN!
		);

		return push.status
			? { status: true, repoUrl: creation.repoUrl }
			: { status: false, error: push.error };
	};
}
