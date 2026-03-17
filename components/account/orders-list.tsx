"use client"

import { useEffect, useState } from "react"
import { getMyOrders } from "@/app/checkoutee/actions"
import { Badge } from "@/components/ui/badge"
import { Package, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

// ✅ Strapi v5 - بدون attributes
interface Order {
  id: string | number;
  documentId: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  statu: string;        // اسمه statu في الصورة (بدون s)
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: Record<string, unknown>;
  orderItems: OrderItem[];
}

interface OrderItem {
  id: string | number;
  quantite: number;   // اسمه quantite في الصورة
  price: number;
}

export function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      const data = await getMyOrders()
      setOrders(data || [])
      setLoading(false)
    }
    fetchOrders()
  }, [])

  if (loading) return (
    <div className="space-y-4">
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  )

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-3xl">
        <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
        <p>لم تقم بأي طلبات بعد</p>
        <Link href="/products" className="text-primary font-bold text-sm hover:underline mt-2 inline-block">
          ابدأ التسوق الآن
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="group border rounded-2xl p-4 hover:border-primary/50 transition-all bg-white shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex gap-4">
              <div className="bg-primary/10 h-12 w-12 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Package className="h-6 w-6" />
              </div>
              <div>
                {/* ✅ مباشرة بدون .attributes */}
                <h4 className="font-bold text-gray-900">طلبية #{order.orderNumber}</h4>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                </p>
                <p className="text-sm font-black text-primary mt-1">{order.total} ر.س</p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0">
              <Badge variant="outline" className="rounded-full px-4">
                {getStatusLabel(order.statu)}
              </Badge>
              <Link
              href={`/checkout/success?orderId=${order.id}`}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function getStatusLabel(status: string) {
  const s: Record<string, string> = {
    pending: "قيد المعالجة",
    shipped: "تم الشحن",
    delivered: "تم التوصيل",
    cancelled: "ملغي",
  }
  return s[status] || "تحت المراجعة"
}