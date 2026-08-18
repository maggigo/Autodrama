import { connect } from '../../../lib/mongoose'
import User from '../../../models/user'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export default async function handler(req:any, res:any) {
  await connect()
  if (req.method === 'POST') {
    const { email, password, name, role } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email and password required' })
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ error: 'email already registered' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ email, passwordHash, name, role: role || 'service_advisor' })
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
    res.setHeader('Set-Cookie', `autodrama_token=${token}; HttpOnly; Path=/; Max-Age=604800`)
    return res.status(201).json({ ok: true })
  }
  res.status(405).send('Method not allowed')
}
