import { Application } from 'express';
import { stepOneRoutes } from './step-one';

export /*bundle*/ function routes(app: Application) {
	app.get('/', (req, res) => {
		res.send('hallo!');
	});

	stepOneRoutes.init(app);
}
