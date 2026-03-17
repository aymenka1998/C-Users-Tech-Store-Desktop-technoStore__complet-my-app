// components/filters/sort-select.tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SortSelectProps {
  currentSort?: string
}

export function SortSelect({ currentSort }: SortSelectProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) params.set("sort", value)
    else params.delete("sort")
    router.push(`/products?${params.toString()}`)
  }

  return (
    <Select value={currentSort} onValueChange={handleSort}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="ترتيب حسب" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="createdAt:desc">الأحدث</SelectItem>
        <SelectItem value="price:asc">السعر: من الأقل للأعلى</SelectItem>
        <SelectItem value="price:desc">السعر: من الأعلى للأقل</SelectItem>
        <SelectItem value="rating:desc">الأعلى تقييماً</SelectItem>
      </SelectContent>
    </Select>
  )
}