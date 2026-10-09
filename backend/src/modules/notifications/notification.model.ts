import { Schema, model } from 'mongoose';

// saved first, sent later by a worker (not written yet) so a cliq outage can't lose anything
const notificationSchema = new Schema(
  {
    to: { type: String, required: true },
    kind: { type: String, required: true },
    text: { type: String, required: true },
    link: String,
    status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    tries: { type: Number, default: 0 },
    readAt: Date,
  },
  { timestamps: true },
);
notificationSchema.index({ to: 1, createdAt: -1 });

export const Notification = model('Notification', notificationSchema);
