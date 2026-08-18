import mongoose, { Document, Schema } from 'mongoose'

export interface ILaborLine extends Document {
  labor_line_id: string
  service_order_id: string
  line_number: number
  description?: string
  service_code?: string
  technician_id?: string
  labor_type?: string
  hours_estimated?: number
  hours_actual?: number
  hourly_rate?: number
  line_total?: number
  is_warranty?: boolean
  notes?: string
  status?: string
}

const LaborLineSchema = new Schema<ILaborLine>({
  labor_line_id: { type: String, required: true, unique: true },
  service_order_id: { type: String, required: true },
  line_number: Number,
  description: String,
  service_code: String,
  technician_id: String,
  labor_type: { type: String, enum: ['diagnostic','mechanical','electrical','body_work','inspection','other'] },
  hours_estimated: { type: Number, default: 0 },
  hours_actual: { type: Number, default: 0 },
  hourly_rate: { type: Number, default: 0 },
  line_total: { type: Number, default: 0 },
  is_warranty: { type: Boolean, default: false },
  notes: String,
  status: { type: String, enum: ['pending','in_progress','completed','cancelled'], default: 'pending' }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

LaborLineSchema.pre('save', function (next) {
  const doc = this as any
  if (doc.hours_actual && doc.hourly_rate) doc.line_total = doc.hours_actual * doc.hourly_rate
  else doc.line_total = (doc.hours_estimated || 0) * (doc.hourly_rate || 0)
  next()
})

export default mongoose.models.LaborLine || mongoose.model<ILaborLine>('LaborLine', LaborLineSchema)
