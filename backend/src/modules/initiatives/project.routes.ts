import { Router } from 'express';
import { z } from 'zod';
import { withTransaction } from '../../shared/db.js';
import { auth, needRole, type AuthedRequest } from '../identity/auth.js';
import { AuditLog } from '../audit/audit.model.js';
import { Notification } from '../notifications/notification.model.js';
import { DEPARTMENTS, Project } from './project.model.js';

const newProject = z.object({
  title: z.string().min(3),
  goal: z.string().min(10),
  features: z.string().min(10),
  owners: z.array(z.string().email()).min(1),
  departments: z.array(z.enum(DEPARTMENTS)).min(1),
});

export const projectRoutes = Router();
projectRoutes.use(auth);

projectRoutes.post('/', needRole('leader', 'admin'), async (req: AuthedRequest, res) => {
  const parsed = newProject.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const body = parsed.data;
  const me = req.user!.email;

  // project, history entry and notifications are saved together or not at all
  const project = await withTransaction(async (session) => {
    const [p] = await Project.create(
      [{ ...body, owners: body.owners.map((o) => o.toLowerCase()), createdBy: me, startedAt: new Date() }],
      { session },
    );

    await AuditLog.create([{ entity: 'Project', entityId: p._id, action: 'created', by: me, data: body }], { session });

    await Notification.create(
      p.owners.map((to) => ({
        to,
        kind: 'tagged',
        text: `${me} tagged you on "${p.title}"`,
        link: `/projects/${p._id}`,
      })),
      { session, ordered: true },
    );

    return p;
  });

  res.status(201).json(project);
});

projectRoutes.get('/', async (_req, res) => {
  res.json(await Project.find().sort({ createdAt: -1 }).limit(100));
});

projectRoutes.get('/:id', async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ error: 'project not found' });

  const history = await AuditLog.find({ entity: 'Project', entityId: project._id }).sort({ createdAt: 1 });
  res.json({ project, history });
});
