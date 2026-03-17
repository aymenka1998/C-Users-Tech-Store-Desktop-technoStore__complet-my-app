// app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server"

// GET - جلب محتويات السلة (من Strapi أو localStorage)
export async function GET(request: NextRequest) {
  // يمكن ربطها بـ Strapi لحفظ السلة للمستخدمين المسجلين
  return NextResponse.json({ message: "Cart API" })
}

// POST - إضافة منتج للسلة
export async function POST(request: NextRequest) {
  const body = await request.json()
  // معالجة إضافة المنتج
  return NextResponse.json({ success: true })
}