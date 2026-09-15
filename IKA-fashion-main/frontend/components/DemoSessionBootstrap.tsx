'use client'

// Bootstrap component chạy sớm nhất ở client để inject demo session
// trước khi bất kỳ guard nào đọc localStorage.
import { useEffect } from 'react'
import { injectDemoSessionIfNeeded } from '@/lib/demo-session'

export default function DemoSessionBootstrap() {
  useEffect(() => {
    injectDemoSessionIfNeeded()
  }, [])
  return null
}
