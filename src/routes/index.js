import { Router } from 'express';

import sessionRoutes from './sessions.routes';
import userRoutes from './user.routes';
import mapRoutes from './map.routes';

const routes = Router();

routes.use('/sessions', sessionRoutes);
routes.use('/users', userRoutes);
routes.use('/map', mapRoutes);

export default routes;
