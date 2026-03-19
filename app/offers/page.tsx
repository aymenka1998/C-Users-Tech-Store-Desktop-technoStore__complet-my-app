// app/offers/page.tsx

import React from "react";
import { getProducts } from "@/lib/strapi";
import { ProductCard } from "@/components/product/product-card";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "العروض الحصرية | TechStore",
  description: "اكتشف أفضل العروض والخصومات على المنتجات التقنية",
};

// تعريف Interface دقيق بدلاً من any
interface StrapiProduct {
  id: string | number;
  name?: string;
  slug?: string;
  price?: number;
  discountPrice?: number;
  image?: {
    url: string;
  };
  // أضف أي حقول أخرى تستخدمها في مكون ProductCard
  [key: string]: unknown; 
}

export default async function OffersPage() {
  const response = await getProducts({ 
    filters: { isOffer: { $eq: true } }, 
    populate: '*' 
  });

  // تحديد النوع هنا كـ StrapiProduct[] بدلاً من any
  const products: StrapiProduct[] = (response?.data as StrapiProduct[]) || [];

  return (
    <div className="container mx-auto py-12 px-4" dir="rtl">
      <div className="flex flex-col items-end mb-10 text-right">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">عروض حصرية</h1>
        <p className="text-gray-500 text-lg">أفضل الأسعار لفترة محدودة</p>
        <div className="h-1.5 w-20 bg-blue-600 mt-4 rounded-full"></div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product: StrapiProduct) => (
            <ProductCard 
              key={product.id} 
              product={{
                ...product,
                name: product.name || 'منتج بدون اسم',
                slug: product.slug || '',
              } as React.ComponentProps<typeof ProductCard>['product']} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-2xl text-gray-400">لا توجد عروض متاحة حالياً. تابعنا قريباً!</p>
        </div>
      )}
    </div>
  );
}