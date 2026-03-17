// components/filters/price-filter.tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PriceFilterProps {
  minPrice?: string
  maxPrice?: string
}

export function PriceFilter({ minPrice, maxPrice }: PriceFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [min, setMin] = useState(minPrice || "")
  const [max, setMax] = useState(maxPrice || "")

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams)
    if (min) params.set("minPrice", min)
    else params.delete("minPrice")
    if (max) params.set("maxPrice", max)
    else params.delete("maxPrice")
    params.set("page", "1")
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm">نطاق السعر</h4>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder="من"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          className="w-20"
        />
        <span className="text-muted-foreground">-</span>
        <Input
          type="number"
          placeholder="إلى"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="w-20"
        />
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full"
        onClick={applyPriceFilter}
      >
        تطبيق
      </Button>
    </div>
  )
}