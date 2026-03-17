"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { submitReviewAction } from "@/app/actions/submit-review"

interface Review {
  id: string
  rating: number
  comment: string
  user: string
  date: string
}

interface ProductReviewsProps {
  productId: string // يجب أن يكون documentId في Strapi v5
   productNumericId: number
  slug: string 
  reviews: Review[]
  rating: number
  reviewsCount: number
}



export function ProductReviews({ 
  productId, 
  productNumericId, 
   slug,  
  reviews, 
  rating, 
  reviewsCount 
}: ProductReviewsProps) {
  const router = useRouter()
  const [newReview, setNewReview] = useState<string>("")
  const [newRating, setNewRating] = useState<number>(5)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleSubmitReview = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    
    if (!newReview.trim()) {
      setMessage({ type: "error", text: "الرجاء كتابة تعليق" })
      return
    }

    if (!productId) {
      setMessage({ type: "error", text: "معرف المنتج غير متوفر" })
      return
    }
 setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await submitReviewAction(productId, productNumericId, slug, newRating, newReview)

      if (result.success) {
        setMessage({ type: "success", text: "تم إرسال تقييمك بنجاح ✅" })
        setNewReview("")
        setNewRating(5)
        setTimeout(() => {
          setMessage(null)
          router.refresh()
        }, 2000)
      } else {
        setMessage({ type: "error", text: result.error || "فشل إرسال التقييم" })
      }
    } catch (error: unknown) {
      console.error("Submit error:", error)
      setMessage({ type: "error", text: "حدث خطأ في الاتصال بالسيرفر" })
    } finally {
      setIsSubmitting(false)
    }
  }
   

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-bold">التقييمات</h2>
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-5 w-5 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
            ))}
          </div>
          <span className="text-muted-foreground">({reviewsCount} تقييم)</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-8">
        {/* Breakdown */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-sm w-3">{stars}</span>
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{
                    width: `${reviews.length > 0
                      ? (reviews.filter(r => r.rating === stars).length / reviews.length) * 100
                      : 0}%`
                  }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-8">
                {reviews.filter(r => r.rating === stars).length}
              </span>
            </div>
          ))}
        </div>

        {/* Add Review Form */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">أضف تقييمك</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">التقييم</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setNewRating(star)} className="p-1">
                      <Star className={`h-6 w-6 ${star <= newRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">تعليقك</label>
                <Textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="شاركنا رأيك في المنتج..."
                  rows={3}
                />
              </div>

              {message && (
                <p className={`text-sm font-medium ${message.type === "success" ? "text-green-600" : "text-red-500"}`}>
                  {message.text}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "جاري الإرسال..." : "إرسال التقييم"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            لا توجد تقييمات بعد. كن أول من يقيم هذا المنتج!
          </p>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {review.user?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="font-medium">{review.user}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.date).toLocaleDateString("ar-SA")}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}