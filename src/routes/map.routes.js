import { Router } from 'express';

import MillController from '../app/controllers/MillController';
import HarvestController from '../app/controllers/HarvestController';
import authMiddleware from '../app/middlewares/auth';

const mapRoutes = Router();

mapRoutes.post('/mills', authMiddleware, MillController.store);
mapRoutes.get('/mills', MillController.index);
mapRoutes.put('/mills/:mill_id', authMiddleware, MillController.update);
mapRoutes.delete('/mills/:mill_id', authMiddleware, MillController.delete);

mapRoutes.post('/harvests', authMiddleware, HarvestController.store);
mapRoutes.get('/harvests', HarvestController.index);
mapRoutes.put(
  '/harvests/:harvest_id',
  authMiddleware,
  HarvestController.update,
);
mapRoutes.delete(
  '/harvests/:harvest_id',
  authMiddleware,
  HarvestController.delete,
);

export default mapRoutes;
