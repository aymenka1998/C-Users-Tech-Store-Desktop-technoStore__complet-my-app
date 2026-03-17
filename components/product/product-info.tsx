// components/product/product-info.tsx
"use client"

import { useState } from "react"
import { Star, Truck, Shield, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QuantitySelector } from "./quantity-selector"
import { useCart } from "@/hooks/use-cart"

interface ProductInfoProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    description: string;
    image: string; // تأكد أن هذا الحقل موجود
    images?: string[]; // اجعل هذا اختيارياً إذا أردت
    slug: string;
    rating: number;
    reviewsCount: number;
    quantite: number;
    sku: string;
    category: string;
    tags?: string[]; // اجعل التاجز اختيارية بإضافة علامة الاستفهام
  };
}
export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Badge variant="secondary" className="mb-2">{product.category}</Badge>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(product.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
))}
            
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.reviewsCount} تقييم)
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-primary">{product.price}د.ج</span>
        {product.originalPrice && (
          <>
            <span className="text-xl text-muted-foreground line-through">
              {product.originalPrice}د.ج
            </span>
            <Badge variant="destructive">وفر {discount}%</Badge>
          </>
        )}
      </div>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed">{product.description}</p>

      {/* Stock & SKU */}
      <div className="flex items-center gap-4 text-sm">
        <span className={product.quantite > 0 ? "text-green-600" : "text-red-600"}>
          {product.quantite > 0 ? "✓ متوفر في المخزن" : "✗ غير متوفر"}
        </span>
        <span className="text-muted-foreground">SKU: {product.sku}</span>
      </div>

      {/* Add to Cart */}
      <div className="flex flex-col sm:flex-row gap-4">
        <QuantitySelector
          quantite={quantity}
          onIncrease={() => setQuantity(q => Math.min(q + 1, product.quantite))}
          onDecrease={() => setQuantity(q => Math.max(q - 1, 1))}
          max={product.quantite}
        />
        <Button 
          size="lg" 
          className="flex-1"
          onClick={() => addItem({ ...product, quantity })}
          disabled={product.quantite === 0}
        >
          أضف للسلة
        </Button>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium text-sm">شحن مجاني</p>
            <p className="text-xs text-muted-foreground">للطلبات فوق 20000 د.ح</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium text-sm">ضمان آمن</p>
            <p className="text-xs text-muted-foreground">دفع 100% آمن</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RotateCcw className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium text-sm">إرجاع سهل</p>
            <p className="text-xs text-muted-foreground">خلال 14 يوم</p>
          </div>
        </div>
      </div>
{/* Tags */}
<div className="flex flex-wrap gap-2 pt-4">
  {/* استخدام ?. لضمان عدم الانهيار و || [] لضمان وجود مصفوفة قابلة للمسح (Mapping) */}
  {(product.tags || []).map((tag: string) => (
    <Badge key={tag} variant="outline">
      {tag}
    </Badge>
  ))}
</div>
    </div>    
  )
}