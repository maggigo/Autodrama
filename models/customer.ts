import mongoose, { Document, Schema } from 'mongoose'

export interface ICustomer extends Document {
  customer_id: string
  type: 'individual' | 'business'
  first_name?: string
  last_name?: string
  company_name?: string
  registration_number?: string
  contact_email: string
  contact_phone: string
  language?: string
  status: 'active' | 'inactive' | 'blocked'
  billing_address?: any
  shipping_address?: any
  createdAt: Date
  updatedAt: Date
}

const AddressSchema = new Schema({
  street: String,
  city: String,
  state: String,
  postal_code: String,
  country: String
}, { _id: false })

const CustomerSchema = new Schema<ICustomer>({
  customer_id: { type: String, required: true, unique: true },
  type: { type: String, enum: ['individual','business'], required: true },
  first_name: String,
  last_name: String,
  company_name: String,
  registration_number: String,
  contact_email: { type: String, required: true, unique: true },
  contact_phone: { type: String, required: true },
  language: { type: String, default: 'en' },
  status: { type: String, enum: ['active','inactive','blocked'], default: 'active' },
  billing_address: AddressSchema,
  shipping_address: AddressSchema
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

export default mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema)
