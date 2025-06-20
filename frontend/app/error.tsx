'use client'
import { useEffect } from 'react'

export default function Error({ error }: { error: Error }) {
  useEffect(() => {
    console.error(error)
  }, [error])
  return <div className="p-4 text-red-600">Something went wrong!</div>
}
