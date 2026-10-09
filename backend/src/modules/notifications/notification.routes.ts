import { Router } from 'express';
import { auth, type AuthedRequest } from '../identity/auth.js';
import { Notification } from './notification.model.js';

export const notificationRoutes = Router();
notificationRoutes.use(auth);

notificationRoutes.get('/', async (req: AuthedRequest, res) => {
  const mine = await Notification.find({ to: req.user!.email }).sort({ createdAt: -1 }).limit(50);
  res.json(mine);
});
