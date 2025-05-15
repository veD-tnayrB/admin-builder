import { Project } from '@essential/server/models';
import { Application, Request, Response } from 'express';

export class StepOneRoutes {
	setup = async (req: Request, res: Response) => {
		try {
			const params = {
				id: req.body.id,
				name: req.body.name,
				subName: req.body.subName,
				scope: req.body.scope,
				description: req.body.description,
				author: req.body.author,
				keywords: req.body.keywords,
				title: req.body.title,
				variables: req.body.variables,
			};
			const instance = new Project(params);
			const validationErr = instance.validate();
			if (validationErr) throw validationErr;
			const response = await instance.setup();
			if (!response.status) throw response.error;

			return res.status(200).json(response);
		} catch (error) {
			console.error('ERROR: /setup ', error);
			return res.status(500).send({ status: false, error });
		}
	};

	getThemesTemplate = async (req: Request, res: Response) => {
		try {
			const id = req.params.id;
			if (!id) throw 'ID_REQUIRED';

			const instance = new Project();
			await instance.load(id);
			const response = await instance.getThemeVariables();
			res.attachment(`theme.scss`);
			res.contentType('text/scss');
			return res.send(response.data.file);
		} catch (error) {
			console.error('ERROR: /get-themes-template ', error);
			return res.status(500).send({ status: false, error });
		}
	};

	get = async (req: Request, res: Response) => {
		try {
			const id = req.params.id;
			if (!id) throw 'ID_REQUIRED';

			const instance = new Project();
			const response = await instance.load(id);
			return res.status(200).json(response);
		} catch (error) {
			console.error('ERROR: /get ', error);
			return res.status(500).send({ status: false, error });
		}
	};

	setTheme = async (req: Request, res: Response) => {
		try {
			const id = req.params.id;
			if (!id) throw 'ID_REQUIRED';
			if (!req.body.variables.dark) throw 'DARK_THEME_VARIABLES_REQUIRED';
			if (!req.body.variables.light)
				throw 'LIGHT_THEME_VARIABLES_REQUIRED';

			const instance = new Project();
			const loadRes = await instance.load(id);
			if (!loadRes.status) throw 'ERROR_LOADING_INSTANCE';

			const response = await instance.setTheme({
				dark: req.body.variables.dark,
				light: req.body.variables.light,
			});
			if (!response.status) throw response.error;

			return res.status(200).json(response);
		} catch (error) {
			console.error('ERROR: /theme/variables', error);
			return res.status(500).send({ status: false, error });
		}
	};

	init = (app: Application) => {
		app.post('/project', this.setup);
		app.post('/project/:id/theme/variables', this.setTheme);
		app.get('/project/themes/template/:id', this.getThemesTemplate);
		app.get('/project/:id', this.get);
	};
}

export const stepOneRoutes = new StepOneRoutes();
