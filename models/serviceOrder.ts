import mongoose, { Document, Schema } from 'mongoose'

export interface IServiceOrder extends Document {
  service_order_id: string
  order_number: string
  status: 'draft'|'open'|'in_progress'|'completed'|'cancelled'|'invoiced'|'closed'
  customer_id: string
  vehicle_id: string
  workshop_id: string
  service_appointment_id?: string
  odometer_reading?: number
  fuel_level?: 'empty'|'1/4'|'1/2'|'3/4'|'full'
  vehicle_condition_notes?: string
  customer_complaint?: string
  diagnosis_result?: string
  technician_notes?: string
  customer_authorization_status?: 'pending'|'authorized'|'declined'|'partially_authorized'
  priority?: 'low'|'normal'|'high'|'urgent'
  promised_completion_date?: Date
  actual_completion_date?: Date
  total_labor_cost?: number
  total_parts_cost?: number
  total_discount?: number
  total_tax?: number
  grand_total?: number
}

const ServiceOrderSchema = new Schema<IServiceOrder>({
  service_order_id: { type: String, required: true, unique: true },
  order_number: { type: String, required: true, unique: true },
  status: { type: String, enum: ['draft','open','in_progress','completed','cancelled','invoiced','closed'], default: 'draft' },

  customer_id: { type: String, required: true },
  vehicle_id: { type: String, required: true },
  workshop_id: { type: String },
  service_appointment_id: { type: String },

  odometer_reading: Number,
  fuel_level: { type: String, enum: ['empty','1/4','1/2','3/4','full'] },
  vehicle_condition_notes: String,
  customer_complaint: String,
  diagnosis_result: String,
  technician_notes: String,
  customer_authorization_status: { type: String, enum: ['pending','authorized','declined','partially_authorized'], default: 'pending' },
  priority: { type: String, enum: ['low','normal','high','urgent'], default: 'normal' },
  promised_completion_date: Date,
  actual_completion_date: Date,
  total_labor_cost: { type: Number, default: 0 },
  total_parts_cost: { type: Number, default: 0 },
  total_discount: { type: Number, default: 0 },
  total_tax: { type: Number, default: 0 },
  grand_total: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

// Business rule helpers
ServiceOrderSchema.methods.canStartWork = function () {
  // must be authorized (authorized or partially_authorized) and have at least one line
  return (this.customer_authorization_status === 'authorized' || this.customer_authorization_status === 'partially_authorized')
}

export default mongoose.models.ServiceOrder || mongoose.model<IServiceOrder>('ServiceOrder', ServiceOrderSchema)
