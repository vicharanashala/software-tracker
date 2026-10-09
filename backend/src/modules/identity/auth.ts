import type { NextFunction, Request, Response } from 'express';
import { config } from '../../shared/config.js';
import { User } from './user.model.js';

export interface AuthedRequest extends Request {
  user?: { id: string; email: string; name: string; roles: string[] };
}

// temporary: we trust the x-user-email header. swap for google login before real use
export async function auth(req: AuthedRequest, res: Response, next: NextFunction) {
  if (!config.devAuth) return res.status(501).json({ error: 'login not built yet' });

  const email = (req.header('x-user-email') || '').toLowerCase().trim();
  if (!email) return res.status(401).json({ error: 'x-user-email header missing' });

  const roles = (req.header('x-user-roles') || '').split(',').filter(Boolean);
  const user = await User.findOneAndUpdate(
    { email },
    { $setOnInsert: { email, name: email.split('@')[0], roles: roles.length ? roles : ['engineer'] } },
    { upsert: true, new: true },
  );

  req.user = { id: String(user._id), email: user.email, name: user.name, roles: user.roles };
  next();
}

export function needRole(...allowed: string[]) {
  return (req: AuthedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.roles.some((r) => allowed.includes(r))) {
      return res.status(403).json({ error: 'not allowed, need: ' + allowed.join(' / ') });
    }
    next();
  };
}
