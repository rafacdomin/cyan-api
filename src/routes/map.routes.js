import { Router } from 'express';

import MillController from '../app/controllers/MillController';
import HarvestController from '../app/controllers/HarvestController';
import FarmController from '../app/controllers/FarmController';
import FieldController from '../app/controllers/FieldController';
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

mapRoutes.post('/farms', authMiddleware, FarmController.store);
mapRoutes.get('/farms', FarmController.index);
mapRoutes.put('/farms/:farm_id', authMiddleware, FarmController.update);
mapRoutes.delete('/farms/:farm_id', authMiddleware, FarmController.delete);

mapRoutes.post('/fields', authMiddleware, FieldController.store);
mapRoutes.get('/fields', FieldController.index);
mapRoutes.put('/fields/:field_id', authMiddleware, FieldController.update);
mapRoutes.delete('/fields/:field_id', authMiddleware, FieldController.delete);

export default mapRoutes;
