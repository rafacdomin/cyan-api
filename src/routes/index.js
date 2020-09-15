import { Router } from 'express';

import sessionRoutes from './sessions.routes';
import userRoutes from './user.routes';

const routes = Router();

routes.use('/sessions', sessionRoutes);
routes.use('/users', userRoutes);

export default routes;
