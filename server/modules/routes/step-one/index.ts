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
			};
			const instance = new Project(params);
			const validationErr = instance.validate();
			if (validationErr) throw validationErr;
			const response = await instance.initialize();
			if (!response.status) throw response.error;

			return res.status(200).json(response);
		} catch (error) {
			console.error('ERROR: /setup ', error);
			return res.status(500).send({ status: false, error });
		}
	};

	init = (app: Application) => {
		app.post('/setup', this.setup);
	};
}

export const stepOneRoutes = new StepOneRoutes();
