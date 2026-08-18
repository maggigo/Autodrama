import React, { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')

  async function submit(e:any) {
    e.preventDefault()
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    const data = await res.json()
    if (res.ok) {
      setMsg('Logged in — refresh to see session')
    } else setMsg(data.error || 'login failed')
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <div><label>Email <input value={email} onChange={e=>setEmail(e.target.value)} /></label></div>
        <div><label>Password <input type="password" value={password} onChange={e=>setPassword(e.target.value)} /></label></div>
        <button type="submit">Login</button>
      </form>
      <div>{msg}</div>
    </main>
  )
}
