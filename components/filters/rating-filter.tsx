// components/filters/rating-filter.tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Star } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

const RATINGS = [5, 4, 3, 2, 1]

export function RatingFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentRating = searchParams.get("rating")

  const handleChange = (rating: number) => {
    const params = new URLSearchParams(searchParams)
    if (currentRating === String(rating)) {
      params.delete("rating")
    } else {
      params.set("rating", String(rating))
    }
    params.set("page", "1")
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-sm">التقييم</h4>
      <div className="space-y-2">
        {RATINGS.map((rating) => (
          <label key={rating} className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={currentRating === String(rating)}
              onCheckedChange={() => handleChange(rating)}
            />
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-xs text-muted-foreground mr-1">فأكثر</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}