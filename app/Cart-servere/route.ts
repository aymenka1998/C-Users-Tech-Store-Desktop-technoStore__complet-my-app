// app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server"

// GET - جلب محتويات السلة (من Strapi أو localStorage)
export async function GET(request: NextRequest) {
  try {
    // يمكن ربطها بـ Strapi لحفظ السلة للمستخدمين المسجلين
    return NextResponse.json(
      { message: "Cart API", data: [] },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// POST - إضافة منتج للسلة
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.productId || !body.quantity) {
      return NextResponse.json(
        { error: "Missing required fields: productId, quantity" },
        { status: 400 }
      );
    }

    // معالجة إضافة المنتج
    return NextResponse.json(
      { success: true, message: "Product added to cart" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add product to cart" },
      { status: 500 }
    );
  }
}