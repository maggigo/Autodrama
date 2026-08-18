import { connect } from '../../../lib/mongoose'
import jwt from 'jsonwebtoken'
import User from '../../../models/user'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export default async function handler(req:any, res:any) {
  await connect()
  const cookie = req.headers.cookie || ''
  const match = cookie.match(/autodrama_token=([^;]+)/)
  if (!match) return res.status(200).json({ user: null })
  try {
    const payload:any = jwt.verify(match[1], JWT_SECRET)
    const user = await User.findById(payload.id).select('-passwordHash')
    res.status(200).json({ user })
  } catch (err) {
    res.status(200).json({ user: null })
  }
}
