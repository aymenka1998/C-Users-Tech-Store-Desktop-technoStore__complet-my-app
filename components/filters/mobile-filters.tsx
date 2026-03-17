"use client"

import { useState } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CategoryFilter } from "./category-filter"
import { PriceFilter } from "./price-filter"
import { RatingFilter } from "./rating-filter"

interface Category {
  id: string
  name: string
  slug: string
  count: number
}

interface MobileFiltersProps {
  categories: Category[]
  minPrice?: string
  maxPrice?: string
}

export function MobileFilters({ categories, minPrice, maxPrice }: MobileFiltersProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* زر الفلاتر */}
      <Button
        variant="outline"
        className="flex items-center gap-2 lg:hidden"
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal className="h-4 w-4" />
        الفلاتر
      </Button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer من اليمين */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] bg-white dark:bg-card z-50 shadow-xl transform transition-transform duration-300 lg:hidden overflow-y-auto ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold text-lg">الفلاتر</h3>
          <button onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* محتوى الفلاتر */}
        <div className="p-4 space-y-6">
          <CategoryFilter categories={categories} />
          <PriceFilter minPrice={minPrice} maxPrice={maxPrice} />
          <RatingFilter />
        </div>

        {/* زر التطبيق */}
        <div className="p-4 border-t">
          <Button className="w-full" onClick={() => setOpen(false)}>
            عرض النتائج
          </Button>
        </div>
      </div>
    </>
  )
}