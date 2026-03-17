// components/product/quantity-selector.tsx
"use client"

import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuantitySelectorProps {
  quantite: number
  onIncrease: () => void
  onDecrease: () => void
  max?: number
  min?: number
}

export function QuantitySelector({
  quantite,
  onIncrease,
  onDecrease,
  max = 99,
  min = 1,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center border rounded-md">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-none"
        onClick={onDecrease}
        disabled={quantite <= min}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-12 text-center font-medium">{quantite}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-none"
        onClick={onIncrease}
        disabled={quantite >= max}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}