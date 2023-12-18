import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route.js';
import { DocRoutes } from '../modules/documents/document.route.js';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/docs',
    route : DocRoutes
  }

];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;