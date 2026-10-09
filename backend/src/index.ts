import express from 'express';
import { config } from './shared/config.js';
import { connectDb } from './shared/db.js';
import { projectRoutes } from './modules/initiatives/project.routes.js';
import { notificationRoutes } from './modules/notifications/notification.routes.js';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/projects', projectRoutes);
app.use('/notifications', notificationRoutes);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'something broke' });
});

await connectDb();
app.listen(config.port, () => console.log('listening on ' + config.port));
