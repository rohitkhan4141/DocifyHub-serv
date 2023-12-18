import express from 'express';
import validateRequest from '../../middlewares/validateRequest.js';
import { UserValidation } from '../user/user.validation.js';
import { AuthController } from './auth.controller.js';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(UserValidation.createUserZodSchema),
  AuthController.signUpUserController
);

router.post('/login',
validateRequest(UserValidation.loginUserZodSchema),
AuthController.loginUserController)


export const AuthRoutes = router;