# Environment Variables للنسخ واللصق على Vercel

## تعليمات الاستخدام:
1. اذهب: Vercel Dashboard → Project Settings → Environment Variables
2. اضغط: "Add New"
3. انسخ واحد من الأقسام أدناه حسب البيئة المطلوبة
4. غير القيم الزرقاء بالقيم الفعلية
5. اختر البيئة المناسبة (Production, Preview, Development)
6. اضغط: Save

---

## 🌐 Production Environment

### استخدام الجداول أدناه:

**المتغيرات العامة (لـ Production و Preview):**

```
NEXT_PUBLIC_STRAPI_URL
https://your-strapi-instance.strapi.cloud

NEXT_PUBLIC_APP_URL
https://yourdomain.com

RESEND_FROM_EMAIL
noreply@yourdomain.com
```

**المتغيرات الحساسة (Production فقط):**

```
STRAPI_API_TOKEN
your_production_strapi_api_token_here_very_long_string

RESEND_API_KEY
re_your_production_resend_api_key_here
```

---

## 🧪 Preview/Staging Environment

**للـ Pull Requests والـ Preview Deployments:**

```
STRAPI_API_TOKEN
your_staging_strapi_api_token_here

RESEND_API_KEY
re_your_staging_resend_api_key_here
```

---

## 📝 قالب للنسخ المباشر

### لـ Production:

```
# الخطوة 1: أضف هذه المتغيرات (متاح لـ Production + Preview)
---
KEY: NEXT_PUBLIC_STRAPI_URL
VALUE: https://your-strapi-instance.strapi.cloud
ENVIRONMENT: Production, Preview
---

KEY: NEXT_PUBLIC_APP_URL
VALUE: https://yourdomain.com
ENVIRONMENT: Production, Preview
---

KEY: RESEND_FROM_EMAIL
VALUE: noreply@yourdomain.com
ENVIRONMENT: Production, Preview

# الخطوة 2: أضف هذه المتغيرات (Production فقط)
---
KEY: STRAPI_API_TOKEN
VALUE: [انسخ من Strapi Settings → API Tokens]
ENVIRONMENT: Production Only
---

KEY: RESEND_API_KEY
VALUE: [انسخ من Resend Dashboard → API Keys]
ENVIRONMENT: Production Only
```

---

## 🔑 أين تجد القيم

### 1️⃣ STRAPI_API_TOKEN

```
الموقع: 
  dashboard.strapi.cloud 
    → [Your Project]
    → Settings
    → API Tokens

الخطوات:
1. اضغط "Create new API token"
2. اسم: "Vercel Production"
3. اختر Type: "Custom"
4. اختر Duration: "90 days"
5. امنح صلاحيات الـ read للمنتجات
6. اضغط "Save"
7. انسخ الـ token الطويل
```

### 2️⃣ RESEND_API_KEY

```
الموقع:
  dashboard.resend.com
    → API Keys

الخطوات:
1. اختر "Default" API Key
2. اضغط نسخ (Copy)
3. ابدأ بـ "re_"
```

### 3️⃣ NEXT_PUBLIC_STRAPI_URL

```
الموقع:
  Strapi Cloud Dashboard
    → Project Overview

مثال:
  https://my-project.strapi.cloud
```

### 4️⃣ NEXT_PUBLIC_APP_URL

```
خيار 1: استخدم vercel subdomain
  https://yourdomain.vercel.app

خيار 2: استخدم domain مخصص (بعد الربط)
  https://yourdomain.com
```

### 5️⃣ RESEND_FROM_EMAIL

```
اختر بريد بدون رد:
  noreply@yourdomain.com
  
أو:
  support@yourdomain.com

تأكد: البريد موثق في Resend
```

---

## ✨ مثال حقيقي كامل

```
# لنفترض أن:
# - Domain: technostore.com
# - Strapi: technostore.strapi.cloud
# - Resend: مسجل

NEXT_PUBLIC_STRAPI_URL
https://technostore.strapi.cloud

NEXT_PUBLIC_APP_URL
https://technostore.com

RESEND_FROM_EMAIL
noreply@technostore.com

STRAPI_API_TOKEN
8f4a9b2c1d7e3f6a9b2c1d7e3f6a9b2c1d7e3f6a9b2c1d7e3f6a9b2c1d7e3f6a

RESEND_API_KEY
re_8f4a9b2c1d7e3f6a9b2c1d7e3f6a9b2c
```

---

## 🔄 تحديث المتغيرات

### متى تحتاج تحديث؟

```
✅ كل 90 يوم: جدّد STRAPI_API_TOKEN و RESEND_API_KEY
✅ عند تغيير domain: حدّث NEXT_PUBLIC_APP_URL و RESEND_FROM_EMAIL
✅ عند نقل Strapi: حدّث NEXT_PUBLIC_STRAPI_URL
```

### خطوات التحديث:

1. Vercel Dashboard → Settings → Environment Variables
2. ابحث عن المتغير
3. اضغط على الثلاث نقاط → Edit
4. غير القيمة
5. اضغط "Save"
6. اضغط "Redeploy" (تلقائياً)

---

## ⚠️ تنبيهات أمنية

- ❌ لا تضع secrets في `.env.local` و تحفظها في Git
- ❌ لا تشاركها عبر البريد أو المحادثات
- ❌ لا تستخدم نفس الـ token لـ production و staging
- ✅ استخدم Vercel Secret Manager فقط
- ✅ حافظ على سرية الـ tokens والـ keys
- ✅ جدّد tokens بشكل منتظم

---

## 🧪 اختبار المتغيرات بعد الحفظ

في Terminal بعد الإطلاق:

```bash
# اختبر الاتصال بـ Strapi
curl https://your-strapi-instance.strapi.cloud/api/products

# اختبر الموقع
curl https://yourdomain.com

# اعرض logs
vercel logs
```

---

## 📱 Mobile/Testing

إذا أردت اختبار staging على الهاتف:

```
Preview URL: https://project-staging.vercel.app
استخدم نفس المتغيرات مع staging tokens
```

---

## 🆘 استكشاف الأخطاء

### خطأ: "Cannot reach Strapi"
```
✅ تحقق من NEXT_PUBLIC_STRAPI_URL
✅ تأكد أنها HTTPS
✅ تحقق من Strapi online
```

### خطأ: "Invalid API Token"
```
✅ انسخ token الجديد من Strapi
✅ أعد الحفظ على Vercel
✅ اضغط Redeploy
```

### خطأ: "Resend API Key invalid"
```
✅ تحقق من RESEND_API_KEY
✅ تأكد أنها تبدأ بـ "re_"
✅ جدّد الـ key من Resend
```

---

**آخر تحديث:** 19 مايو 2026
