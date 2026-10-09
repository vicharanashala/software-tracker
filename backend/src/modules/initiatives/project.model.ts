import { Schema, model } from 'mongoose';

export const DEPARTMENTS = ['AI', 'Development', 'Operations'] as const;

export const STATUSES = ['Tagged', 'Alignment', 'Go', 'NoGo', 'Backlog', 'Planned', 'InProgress', 'Done'];

const projectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    goal: { type: String, required: true },
    features: { type: String, required: true },
    createdBy: { type: String, required: true },
    owners: { type: [String], required: true },
    departments: { type: [String], enum: DEPARTMENTS, required: true },
    status: { type: String, enum: STATUSES, default: 'Tagged' },
    startedAt: { type: Date, required: true },
  },
  { timestamps: true },
);

export const Project = model('Project', projectSchema);
