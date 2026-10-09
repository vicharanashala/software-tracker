import { Schema, model } from 'mongoose';

export const ROLES = ['leader', 'project_head', 'team_lead', 'engineer', 'tester', 'ops', 'admin'];

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true },
    roles: { type: [String], enum: ROLES, default: ['engineer'] },
    department: String,
  },
  { timestamps: true },
);

export const User = model('User', userSchema);
