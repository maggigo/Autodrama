import { connect } from '../../../lib/mongoose'
import User from '../../../models/user'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

export default async function handler(req:any, res:any) {
  await connect()
  if (req.method === 'POST') {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'email and password required' })
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'invalid credentials' })
    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) return res.status(401).json({ error: 'invalid credentials' })
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' })
    res.setHeader('Set-Cookie', `autodrama_token=${token}; HttpOnly; Path=/; Max-Age=604800`)
    return res.status(200).json({ ok: true })
  }
  res.status(405).send('Method not allowed')
}
