import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  email: string
  passwordHash: string
  name?: string
  role: 'admin' | 'service_advisor' | 'technician' | 'manager' | 'front_desk'
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String },
  role: { type: String, enum: ['admin','service_advisor','technician','manager','front_desk'], default: 'service_advisor' },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
