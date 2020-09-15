import { Router } from 'express';
import UserController from '../app/controllers/UserController';

const userRoutes = Router();

userRoutes.post('/', UserController.store);

export default userRoutes;
