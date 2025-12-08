'use client'

import styles from "@/app/login/login.module.scss"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { login } from "@/services/auth"

export default function LoginPage() {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password);
      router.push('/admin');
    } catch (err: unknown) {
      const error = err as Error;
      console.error("❌ Error: " + error.message);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.login_wrapper}>
      <form onSubmit={handleSubmit} >
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Входим…' : 'Войти'}
        </button>
      </form>
    </div>
  )
}
