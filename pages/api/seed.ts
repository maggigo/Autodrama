import { connect } from '../../lib/mongoose'
import User from '../../models/user'
import Customer from '../../models/customer'
import ServiceOrder from '../../models/serviceOrder'
import ItemLine from '../../models/itemLine'
import LaborLine from '../../models/laborLine'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

export default async function handler(req:any, res:any) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed')
  await connect()

  // wipe collections (dev only)
  await Promise.all([
    User.deleteMany({}),
    Customer.deleteMany({}),
    ServiceOrder.deleteMany({}),
    ItemLine.deleteMany({}),
    LaborLine.deleteMany({})
  ])

  const roles = ['admin','service_advisor','technician','manager','front_desk']
  const users:any[] = []
  for (const role of roles) {
    for (let i = 1; i <= 3; i++) {
      const email = `${role}${i}@example.com`
      const passwordHash = await bcrypt.hash('password', 10)
      const u = await User.create({ email, passwordHash, name: `${role}-${i}`, role })
      users.push(u)
    }
  }

  // dealerships / workshops
  const workshops:any[] = []
  for (let d = 1; d <= 2; d++) {
    for (let l = 1; l <= 2; l++) {
      workshops.push({ workshop_id: uuidv4(), name: `Dealership ${d} - Location ${l}`, type: 'dealership' })
    }
  }

  // customers
  const c1 = await Customer.create({ customer_id: uuidv4(), type: 'individual', first_name: 'John', last_name: 'Doe', contact_email: 'john.doe@example.com', contact_phone: '+15551234' })
  const c2 = await Customer.create({ customer_id: uuidv4(), type: 'individual', first_name: 'Jane', last_name: 'Smith', contact_email: 'jane.smith@example.com', contact_phone: '+15559876' })

  // service orders sample
  const so1 = await ServiceOrder.create({ service_order_id: uuidv4(), order_number: 'SO-2026-0001', status: 'open', customer_id: c1.customer_id, vehicle_id: 'VIN-111-222', workshop_id: workshops[0].workshop_id, customer_authorization_status: 'authorized' })
  const il1 = await ItemLine.create({ item_line_id: uuidv4(), service_order_id: so1.service_order_id, line_number: 1, item_name: 'Oil Filter', quantity: 1, unit_price: 25.0, tax_rate: 8.25 })
  const ll1 = await LaborLine.create({ labor_line_id: uuidv4(), service_order_id: so1.service_order_id, line_number: 1, description: 'Oil change labor', hours_actual: 1.0, hourly_rate: 80 })

  // Recalculate totals
  const itemTotals = await ItemLine.aggregate([{ $match: { service_order_id: so1.service_order_id } }, { $group: { _id: null, total: { $sum: '$line_total' }, tax: { $sum: '$tax_amount' } } }])
  const laborTotals = await LaborLine.aggregate([{ $match: { service_order_id: so1.service_order_id } }, { $group: { _id: null, total: { $sum: '$line_total' } } }])
  const parts = (itemTotals[0] && itemTotals[0].total) || 0
  const labor = (laborTotals[0] && laborTotals[0].total) || 0
  const tax = (itemTotals[0] && itemTotals[0].tax) || 0
  so1.total_parts_cost = parts
  so1.total_labor_cost = labor
  so1.total_tax = tax
  so1.grand_total = parts + labor + tax
  await so1.save()

  res.status(200).json({ ok: true, usersCreated: users.length })
}
