'use client'

import React from 'react'
import TrademarkSearch from '@/components/TrademarkSearch'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Trademark Search</h1>
      <TrademarkSearch />
    </main>
  )
}

