// components/filters/active-filters.tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Category {
  id: string
  name: string
  slug: string
}

interface ActiveFiltersProps {
  category?: string
  categories: Category[]
}

export function ActiveFilters({ category, categories }: ActiveFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const activeFilters: { label: string; onRemove: () => void }[] = []

  if (category) {
    const cat = categories.find((c) => c.slug === category)
    if (cat) {
      activeFilters.push({
        label: cat.name,
        onRemove: () => {
          const params = new URLSearchParams(searchParams)
          params.delete("category")
          router.push(`/products?${params.toString()}`)
        },
      })
    }
  }

  if (activeFilters.length === 0) return null

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground">الفلاتر النشطة:</span>
      {activeFilters.map((filter, index) => (
        <Badge key={index} variant="secondary" className="gap-1">
          {filter.label}
          <button
            onClick={filter.onRemove}
            className="hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push("/products")}
      >
        إزالة الكل
      </Button>
    </div>
  )
}