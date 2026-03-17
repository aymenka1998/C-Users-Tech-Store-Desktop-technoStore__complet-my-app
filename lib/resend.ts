import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

// ✅ تعريف أنواع البيانات للطلبات بدلاً من any
interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface ShippingAddress {
  fullName: string
  phone: string
  address: string
  city: string
}

interface OrderData {
  orderNumber: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  shippingAddress: ShippingAddress
}

// ✅ إيميل الترحيب
export async function sendWelcomeEmail(to: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: `متجري <${FROM_EMAIL}>`,
      to: [to], // تم تصحيحها لتقبل مصفوفة أو نص بناءً على تحديثات resend
      subject: 'مرحباً بك في متجري! 🎉',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">مرحباً ${name}! 👋</h1>
            <p style="margin: 10px 0 0; font-size: 16px;">تم إنشاء حسابك بنجاح</p>
          </div>
          <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              شكراً لانضمامك إلى متجري! نحن سعداء بوجودك معنا.
            </p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/products" 
               style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px;">
              ابدأ التسوق الآن
            </a>
          </div>
        </div>
      `,
    })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Welcome email error:', error)
    return { success: false, error }
  }
}

// ✅ إيميل استعادة كلمة المرور
export async function sendPasswordResetEmail(to: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
  
  try {
    const { data, error } = await resend.emails.send({
      from: `متجري <${FROM_EMAIL}>`,
      to: [to],
      subject: 'استعادة كلمة المرور - متجري',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #dc2626; padding: 40px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">استعادة كلمة المرور</h1>
          </div>
          <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none;">
            <a href="${resetUrl}" 
               style="display: inline-block; background: #dc2626; color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">
              إعادة تعيين كلمة المرور
            </a>
          </div>
        </div>
      `,
    })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Password reset email error:', error)
    return { success: false, error }
  }
}

// ✅ إيميل تأكيد الطلب - تم حذف any واستخدام OrderData
export async function sendOrderConfirmationEmail(to: string, orderData: OrderData) {
  try {
    const { data, error } = await resend.emails.send({
      from: `متجري <${FROM_EMAIL}>`,
      to: [to],
      subject: `تأكيد الطلب #${orderData.orderNumber} - متجري`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #059669; padding: 40px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">تم استلام طلبك! ✅</h1>
            <p style="margin: 10px 0 0; font-size: 16px;">رقم الطلب: ${orderData.orderNumber}</p>
          </div>
          <div style="background: #ffffff; padding: 40px; border: 1px solid #e5e7eb; border-top: none;">
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="padding: 12px; text-align: right;">المنتج</th>
                  <th style="padding: 12px; text-align: center;">الكمية</th>
                  <th style="padding: 12px; text-align: left;">السعر</th>
                </tr>
              </thead>
              <tbody>
                ${orderData.items.map((item) => `
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
                    <td style="padding: 12px; text-align: center; border-bottom: 1px solid #e5e7eb;">${item.quantity}</td>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb;">${item.price} دج</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px;">
              <div style="font-weight: bold; font-size: 18px; color: #059669; display: flex; justify-content: space-between;">
                <span>الإجمالي:</span>
                <span>${orderData.total} دج</span>
              </div>
            </div>
          </div>
        </div>
      `,
    })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Order confirmation email error:', error)
    return { success: false, error }
  }
}

// ✅ إيميل عام
export async function sendCustomEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: `متجري <${FROM_EMAIL}>`,
      to: [to],
      subject,
      html: `<div dir="rtl" style="font-family: Arial, sans-serif;">${html}</div>`,
    })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Custom email error:', error)
    return { success: false, error }
  }
}