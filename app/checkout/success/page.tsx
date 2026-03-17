import { getOrderById } from "@/lib/strapi";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product?: {
    name: string;
    image?: {
      url: string;
    };
  };
}

interface OrderData {
  id: number;
  documentId: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId: string }>;
}) {
  const { orderId } = await searchParams;
  const response = await getOrderById(orderId);
  
  // في Strapi 5، البيانات تكون مباشرة داخل data بدون attributes
  const order = response?.data as OrderData | undefined;

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-20 text-center" dir="rtl">
        <div className="max-w-md mx-auto border rounded-2xl p-8 bg-white shadow-sm">
          <h2 className="text-2xl font-bold text-red-500 mb-4">عذراً!</h2>
          <p className="text-gray-600 mb-6">لم نتمكن من العثور على تفاصيل الطلب رقم {orderId}. قد يستغرق النظام ثوانٍ لتحديث البيانات.</p>
          <Link href="/products" className="text-primary hover:underline">العودة للمتجر</Link>
        </div>
      </div>
    );
  }

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

  return (
    <div className="container mx-auto px-4 py-16 text-right" dir="rtl">
      <div className="max-w-3xl mx-auto border rounded-2xl p-8 bg-white dark:bg-card shadow-lg">
        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">تم استلام طلبك بنجاح!</h1>
          <p className="text-muted-foreground mt-2 text-lg">شكراً لثقتك بنا. طلبك قيد المراجعة الآن.</p>
          <div className="inline-block bg-gray-100 dark:bg-slate-800 px-4 py-1 rounded-full mt-4 text-sm font-mono">
            رقم الطلب: {order.documentId || order.id}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b pb-3">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">ملخص الطلب</h3>
          </div>

          <div className="divide-y">
            {order.items?.map((item) => {
              const product = item.product;
              const imageUrl = product?.image?.url;
              
              return (
                <div key={item.id} className="flex justify-between items-center py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 bg-gray-50 rounded-xl overflow-hidden border">
                      <Image 
                        src={imageUrl ? (imageUrl.startsWith("http") ? imageUrl : `${STRAPI_URL}${imageUrl}`) : "/images/placeholder.jpg"}
                        alt={product?.name || "Product"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 dark:text-gray-200">{product?.name}</p>
                      <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
                      <p className="text-sm font-medium sm:hidden">{item.price} ر.س</p>
                    </div>
                  </div>
                  <p className="font-bold text-lg hidden sm:block">{item.price * item.quantity} ر.س</p>
                </div>
              );
            })}
          </div>

          {/* Pricing Calculation */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl space-y-3">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>إجمالي المنتجات:</span>
              <span>{order.totalAmount} ر.س</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>التوصيل:</span>
              <span className="text-green-600 font-medium">مجاني</span>
            </div>
            <div className="flex justify-between font-bold text-xl border-t pt-4 text-primary">
              <span>المجموع الكلي:</span>
              <span>{order.totalAmount} ر.س</span>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/products" 
            className="bg-primary text-white px-10 py-4 rounded-xl hover:bg-primary/90 transition shadow-md text-center font-bold"
          >
            مواصلة التسوق
          </Link>
          <Link 
            href="/account/orders" 
            className="border-2 border-gray-200 dark:border-slate-700 px-10 py-4 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition text-center font-bold"
          >
            تتبع طلباتي
          </Link>
        </div>
      </div>
    </div>
  );
}