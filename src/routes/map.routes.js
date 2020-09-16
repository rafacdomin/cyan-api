import { Router } from 'express';

import MillController from '../app/controllers/MillController';
import authMiddleware from '../app/middlewares/auth';

const mapRoutes = Router();

mapRoutes.post('/mills', authMiddleware, MillController.store);
mapRoutes.get('/mills', MillController.index);
mapRoutes.put('/mills/:mill_id', authMiddleware, MillController.update);
mapRoutes.delete('/mills/:mill_id', authMiddleware, MillController.delete);

export default mapRoutes;
