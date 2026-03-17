// components/filters/category-filter.tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"

interface Category {
  id: string
  name: string
  slug: string
  count: number
}

interface CategoryFilterProps {
  categories: Category[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category")

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams)
    if (currentCategory === slug) {
      params.delete("category")
    } else {
      params.set("category", slug)
    }
    params.set("page", "1")
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm">الفئات</h4>
      <div className="space-y-2">
        {categories.map((category) => (
          <label
            key={category.id}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Checkbox
                checked={currentCategory === category.slug}
                onCheckedChange={() => handleCategoryChange(category.slug)}
              />
              <span className="text-sm">{category.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">({category.count})</span>
          </label>
        ))}
      </div>
    </div>
  )
}