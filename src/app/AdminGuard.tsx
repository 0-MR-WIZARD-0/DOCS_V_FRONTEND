'use client'
import { useAppSelector } from '@/store/hooks'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const isAuth = useAppSelector(state => state.auth.isAuth)
  const loading = useAppSelector(state => state.auth.loading)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && pathname.startsWith('/admin') && !isAuth) {
      router.replace('/login')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth, loading, pathname])

  if (loading) return <div>Loading...</div>

  if (!pathname.startsWith('/admin')) return <>{children}</>

  return <>{children}</>
}
