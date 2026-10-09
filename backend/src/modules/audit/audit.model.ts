import { Schema, model } from 'mongoose';

// history of everything that happens. only ever insert here, never edit or delete
const auditSchema = new Schema(
  {
    entity: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    action: { type: String, required: true },
    by: { type: String, required: true },
    data: Schema.Types.Mixed,
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
auditSchema.index({ entity: 1, entityId: 1, createdAt: 1 });

export const AuditLog = model('AuditLog', auditSchema);
