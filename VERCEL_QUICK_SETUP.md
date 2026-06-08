# ⚡ الإعدادات السريعة لـ Vercel (Quick Setup)

## في 5 خطوات فقط:

### 1️⃣ توصيل GitHub
```
- اذهب vercel.com
- اضغط "Add New" → "Project"
- اختر repository المشروع
- اضغط "Import"
```

### 2️⃣ إضافة متغيرات البيئة

**في Vercel Dashboard → Settings → Environment Variables:**

| المتغير | القيمة | البيئة |
|--------|--------|--------|
| `NEXT_PUBLIC_STRAPI_URL` | `https://your-strapi.strapi.cloud` | Production + Preview |
| `NEXT_PUBLIC_APP_URL` | `https://yourdomain.vercel.app` | Production + Preview |
| `RESEND_FROM_EMAIL` | `noreply@yourdomain.com` | Production + Preview |
| `STRAPI_API_TOKEN` | `your_strapi_token_prod` | Production فقط |
| `RESEND_API_KEY` | `your_resend_key_prod` | Production فقط |

### 3️⃣ تأكيد إعدادات البناء

في نفس Settings:
- **Framework:** Next.js ✅
- **Build Command:** `npm run build`
- **Install Command:** `npm install`
- **Output Directory:** `.next`

### 4️⃣ الإطلاق

```
اضغط زر "Deploy" أو 
انتظر auto-deploy من main branch
```

### 5️⃣ اختبار سريع

بعد الإطلاق:
```bash
# اختبر الموقع
curl https://yourdomain.vercel.app

# اختبر API الـ Strapi
curl https://yourdomain.vercel.app/api/products

# اختبر السجلات
vercel logs
```

---

## 🔗 روابط مهمة أثناء الإعداد

| الخدمة | الرابط | ماذا تحتاج |
|-------|--------|-----------|
| Strapi API Token | dashboard.strapi.cloud → Settings | انسخ token |
| Resend API Key | dashboard.resend.com → API Keys | انسخ key |
| Vercel Dashboard | vercel.com/dashboard | Environment vars |

---

## ✅ قائمة التحقق النهائية

قبل الإطلاق النهائي:

- [ ] تم ربط GitHub Repository
- [ ] تم إضافة جميع Environment Variables
- [ ] STRAPI_API_TOKEN صحيح
- [ ] RESEND_API_KEY صحيح
- [ ] NEXT_PUBLIC_STRAPI_URL يشير للـ production Strapi
- [ ] تم اختبار البناء المحلي (`npm run build`)
- [ ] لا توجد أخطاء TypeScript
- [ ] تم اختبار تسجيل مستخدم جديد
- [ ] تم اختبار وصول البريد الإلكتروني
- [ ] تم اختبار عرض المنتجات

---

## 🚨 أخطاء شائعة وحلولها

### ❌ "Build failed"
```
✅ تأكد: npm run build تعمل محلياً
✅ تحقق: لا توجد أخطاء TypeScript
✅ افحص: جميع imports صحيحة
```

### ❌ "STRAPI_API_TOKEN undefined"
```
✅ اذهب: Vercel Settings → Environment Variables
✅ أضف: STRAPI_API_TOKEN
✅ اضغط: Redeploy
```

### ❌ "Connection refused to Strapi"
```
✅ تحقق: NEXT_PUBLIC_STRAPI_URL صحيح
✅ تأكد: Strapi مرفع online
✅ افحص: CORS مفعل في Strapi
```

### ❌ "البريد لا يصل"
```
✅ تحقق: RESEND_API_KEY صحيح
✅ تأكد: RESEND_FROM_EMAIL موثقة
✅ افحص: Resend logs للأخطاء
```

---

## 📌 ملاحظات مهمة

⚠️ **لا تنسى:**
- غير `yourdomain.vercel.app` باسم domain الفعلي
- غير `yourdomain.com` باسم domain المخصص الفعلي
- استخدم HTTPS دائماً للـ URLs
- API tokens مختلفة لكل environment
- جدّد tokens كل 90 يوم

---

## 🎯 بعد الإطلاق

تفعيل إعدادات إضافية:

```json
// من vercel.json (مفعل تلقائياً):
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "regions": ["iad1"],
  "headers": [
    {
      "key": "X-Content-Type-Options",
      "value": "nosniff"
    }
  ]
}
```

---

**الوقت المقدر:** 15-20 دقيقة ⏱️
