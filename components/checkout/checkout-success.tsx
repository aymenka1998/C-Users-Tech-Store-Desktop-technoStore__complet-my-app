import { Package, MapPin, Truck, Calendar } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function CheckoutSuccessDetails({ order }: { order: any }) {
  const attrs = order.attributes
  const address = attrs.shippingAddress

  return (
    <div className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* رأس الفاتورة */}
      <div className="bg-gray-50/80 p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Package className="h-5 w-5" />
            <span>تفاصيل الشراء</span>
          </div>
          <span className="text-sm font-mono bg-white px-3 py-1 rounded-full border shadow-sm">
            #{attrs.orderNumber}
          </span>
        </div>
        <p className="text-gray-600 font-medium">مرحباً {address.firstName}، طلبك قيد المراجعة الآن.</p>
      </div>

      <div className="p-6 space-y-6">
        {/* قائمة المنتجات */}
        <div className="space-y-4">
          {attrs.orderItems.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center text-sm">
              <div className="flex gap-3 items-center">
                <span className="bg-gray-100 text-gray-700 w-6 h-6 rounded flex items-center justify-center font-bold text-xs">
                  {item.quantity}
                </span>
                <span className="font-semibold text-gray-800 line-clamp-1">
                  {item.product?.data?.attributes?.name || "منتج"}
                </span>
              </div>
              <span className="font-mono text-gray-600">
                {(item.price * item.quantity).toFixed(2)} ر.س
              </span>
            </div>
          ))}
        </div>

        <Separator className="bg-gray-100" />

        {/* ملخص الحساب */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-500">
            <span>المجموع الفرعي</span>
            <span className="font-mono">{attrs.subtotal?.toFixed(2)} ر.س</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>رسوم الشحن</span>
            <span className="font-mono">{attrs.shipping === 0 ? "مجاني" : `${attrs.shipping} ر.س`}</span>
          </div>
          <div className="flex justify-between text-xl font-black text-primary pt-2">
            <span>الإجمالي</span>
            <span className="font-mono tracking-tighter">{attrs.total?.toFixed(2)} ر.س</span>
          </div>
        </div>

        <Separator className="bg-gray-100" />

        {/* معلومات التوصيل */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <p className="text-sm font-bold flex items-center gap-2 text-gray-800">
              <MapPin className="h-4 w-4 text-primary" /> عنوان التوصيل
            </p>
            <div className="text-xs text-muted-foreground leading-relaxed pr-6">
              <p>{address.address}</p>
              <p>{address.city}، {address.postalCode}</p>
              <p className="mt-1 font-mono">{address.phone}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-bold flex items-center gap-2 text-gray-800">
              <Truck className="h-4 w-4 text-primary" /> موعد التوصيل المتوقع
            </p>
            <div className="text-xs text-muted-foreground leading-relaxed pr-6">
              <p>خلال 3 - 5 أيام عمل</p>
              <p className="flex items-center gap-1 mt-1">
                <Calendar className="h-3 w-3" /> {new Date().toLocaleDateString('ar-SA')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}