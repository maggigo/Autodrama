import mongoose, { Document, Schema } from 'mongoose'

export interface IItemLine extends Document {
  item_line_id: string
  service_order_id: string
  line_number: number
  item_code?: string
  item_name?: string
  item_category?: string
  quantity: number
  unit_price: number
  discount_percent?: number
  discount_amount?: number
  line_total: number
  tax_rate?: number
  tax_amount?: number
  is_warranty?: boolean
  is_core_return?: boolean
  core_charge?: number
  stock_location?: string
  bin_location?: string
  status?: string
  notes?: string
  vendor_id?: string
}

const ItemLineSchema = new Schema<IItemLine>({
  item_line_id: { type: String, required: true, unique: true },
  service_order_id: { type: String, required: true },
  line_number: Number,
  item_code: String,
  item_name: String,
  item_category: { type: String, enum: ['genuine','OEM','aftermarket','remanufactured','consumable','fluid','other'] },
  quantity: { type: Number, default: 1 },
  unit_price: { type: Number, default: 0 },
  discount_percent: { type: Number, default: 0 },
  discount_amount: { type: Number, default: 0 },
  line_total: { type: Number, default: 0 },
  tax_rate: { type: Number, default: 0 },
  tax_amount: { type: Number, default: 0 },
  is_warranty: { type: Boolean, default: false },
  is_core_return: { type: Boolean, default: false },
  core_charge: Number,
  stock_location: String,
  bin_location: String,
  status: { type: String, enum: ['ordered','picked','installed','returned','cancelled'], default: 'ordered' },
  notes: String,
  vendor_id: String
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })

ItemLineSchema.pre('save', function (next) {
  // compute line_total and tax
  const doc = this as any
  const base = doc.quantity * doc.unit_price
  if (doc.discount_amount && doc.discount_amount > 0) {
    doc.line_total = base - doc.discount_amount
  } else if (doc.discount_percent && doc.discount_percent > 0) {
    doc.line_total = base * (1 - doc.discount_percent / 100)
  } else {
    doc.line_total = base
  }
  doc.tax_amount = (doc.line_total || 0) * ((doc.tax_rate || 0) / 100)
  next()
})

export default mongoose.models.ItemLine || mongoose.model<IItemLine>('ItemLine', ItemLineSchema)
