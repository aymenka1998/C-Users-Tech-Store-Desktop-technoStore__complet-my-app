# إعداد Vercel خطوة بخطوة 🚀

## المتطلبات الأولية
- حساب GitHub مع Repository المشروع
- حساب Vercel (vercel.com)
- Strapi Cloud Instance
- Resend Account

---

## الخطوة 1️⃣: إنشاء مشروع على Vercel

### أ) تسجيل الدخول إلى Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. اضغط **Sign Up** → اختر **GitHub**
3. أتمم عملية المصادقة

### ب) استيراد المشروع
1. من لوحة التحكم → **Add New** → **Project**
2. اختر **Import Git Repository**
3. ابحث عن repository المشروع
4. اضغط **Import**

---

## الخطوة 2️⃣: تكوين متغيرات البيئة

### في صفحة Project Settings:
1. انقر على **Settings** في الأعلى
2. اختر **Environment Variables** من الشريط الجانبي

### أضف المتغيرات التالية:

#### للـ Production و Preview معاً:

```
NEXT_PUBLIC_STRAPI_URL = https://your-strapi-cloud-url.com
NEXT_PUBLIC_APP_URL = https://yourdomain.vercel.app  (أو domain مخصص)
RESEND_FROM_EMAIL = noreply@yourdomain.com
```

#### للـ Production فقط (اضغط على القائمة المنسدلة واختر Production):

```
STRAPI_API_TOKEN = your_strapi_production_token
RESEND_API_KEY = your_resend_api_key_production
```

#### للـ Preview فقط:

```
STRAPI_API_TOKEN = your_strapi_staging_token
RESEND_API_KEY = your_resend_api_key_staging
```

### مثال على الإضافة:
```
KEY NAME:          NEXT_PUBLIC_STRAPI_URL
VALUE (PROD):      https://your-instance.strapi.cloud
VALUE (PREVIEW):   https://your-instance-staging.strapi.cloud
```

---

## الخطوة 3️⃣: إعدادات البناء (Build Settings)

### في نفس صفحة Settings:

1. **Framework Preset**: Next.js (يجب أن يكون مختاراً تلقائياً)

2. **Build Command**: 
   ```
   npm run build
   ```

3. **Install Command**:
   ```
   npm install
   ```

4. **Output Directory**:
   ```
   .next
   ```

5. **Development Command** (Optional):
   ```
   npm run dev
   ```

---

## الخطوة 4️⃣: تكوين Strapi Cloud

### في لوحة تحكم Strapi Cloud:

1. **API Tokens**:
   - اذهب إلى **Settings** → **API Tokens**
   - اضغط **Create new API token**
   - أعط الـ token اسم: `Vercel Production`
   - اختر Expiration: `90 days` (ثم جدد كل 3 أشهر)
   - اختر Type: `Custom` ثم منح الصلاحيات المطلوبة
   - انسخ الـ token أضفه إلى Vercel

2. **CORS Settings**:
   - اذهب إلى **Settings** → **Security** → **CORS**
   - أضف origin جديد:
     ```
     https://yourdomain.vercel.app
     ```
   - أو إذا كان لديك domain مخصص:
     ```
     https://yourdomain.com
     ```

3. **Content API Permissions**:
   - تأكد من أن API Public عام (يسمح بـ GET بدون token)
   - الـ POST, PUT, DELETE تتطلب token

---

## الخطوة 5️⃣: تكوين Resend

### في لوحة تحكم Resend:

1. **API Keys**:
   - اذهب إلى **Settings** → **API Keys**
   - انسخ **Default** API Key
   - أضفها إلى Vercel كـ `RESEND_API_KEY`

2. **Domain Configuration**:
   - اذهب إلى **Settings** → **Sending Domain**
   - أضف domain مخصص: `noreply@yourdomain.com`
   - اتبع خطوات التحقق من DNS
   - أضف السجلات المطلوبة إلى provider DNS الخاص بك

3. **Sender Email**:
   - في Vercel: `RESEND_FROM_EMAIL = noreply@yourdomain.com`

---

## الخطوة 6️⃣: اختبار الإطلاق

### قبل الإطلاق على Production:

1. **بناء محلي**:
   ```bash
   npm run build
   ```
   - تأكد من عدم وجود أخطاء

2. **اختبار البناء**:
   ```bash
   npm start
   ```
   - اختبر جميع الصفحات الرئيسية

3. **اختبار API**:
   ```bash
   curl https://your-strapi-cloud-url.com/api/products
   ```

4. **اختبار البريد الإلكتروني**:
   - سجل حساب اختبار جديد
   - تحقق من وصول البريد الترحيب
   - افحص Resend logs

---

## الخطوة 7️⃣: الإطلاق على Production

### في صفحة Deployments:

1. **اختر آخر Commit** من الفرع الرئيسي
2. اضغط **Deploy** (أو سيتم الإطلاق تلقائياً عند كل push)
3. انتظر انتهاء البناء (~3-5 دقائق)
4. اضغط **Visit** لعرض الموقع

---

## الخطوة 8️⃣: ربط domain مخصص (اختياري)

### إذا كنت تريد `yourdomain.com` بدل `vercel.app`:

1. في Project Settings → **Domains**
2. اضغط **Add Domain**
3. أدخل اسم domain: `yourdomain.com`
4. اتبع التعليمات لإضافة DNS records
5. الخيارات:
   - **Nameservers**: غير nameservers عند مسجل domain
   - **CNAME**: أضف CNAME record مباشرة

### مثال (GoDaddy DNS):
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com.
```

---

## الخطوة 9️⃣: المراقبة والسجلات

### مراقبة الأداء:
1. **Vercel Analytics**: في Dashboard → **Analytics**
2. **Deployments**: شاهد آخر عمليات إطلاق
3. **Logs**: اضغط على deployment لرؤية السجلات

### التحقق من الأخطاء:
```bash
# عرض السجلات الحية
vercel logs
```

---

## الخطوة 🔟: إعدادات متقدمة (اختياري)

### أ) Auto-deploy من branches معينة:

1. Settings → **Git** → **Production Branch**
2. اختر الفرع الرئيسي (عادةً `main` أو `master`)

### ب) Preview Deployments:

- تُنشأ تلقائياً لكل Pull Request
- مفيدة للاختبار قبل الدمج

### ج) Environment Variables المختلفة:

```
Production:  STRAPI_API_TOKEN = prod_token
Preview:     STRAPI_API_TOKEN = staging_token
Development: STRAPI_API_TOKEN = local_token
```

---

## 🧪 اختبارات ما بعد الإطلاق

### 1️⃣ اختبر التسجيل:
```bash
curl -X POST https://yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"TestPassword123",
    "fullName":"Test User",
    "phone":"+1234567890"
  }'
```

### 2️⃣ اختبر استرجاع المنتجات:
```bash
curl https://yourdomain.com/api/products
```

### 3️⃣ اختبر البريد الإلكتروني:
- سجل حساب جديد
- تحقق من وصول البريد خلال دقيقة واحدة

### 4️⃣ اختبر الأمان:
```bash
# تحقق من رؤوس الأمان
curl -I https://yourdomain.com
```

يجب أن ترى:
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
```

---

## ❌ معالجة الأخطاء الشائعة

### 1. خطأ: "Cannot find module"
```
الحل: npm install && npm run build
```

### 2. خطأ: "STRAPI_API_TOKEN is undefined"
```
الحل: أضف المتغير في Environment Variables على Vercel
```

### 3. خطأ: "Strapi connection refused"
```
الحل: تحقق من NEXT_PUBLIC_STRAPI_URL - يجب أن تكون HTTPS
```

### 4. البريد الإلكتروني لا يصل
```
الحل: 
- تحقق من RESEND_API_KEY
- تحقق من RESEND_FROM_EMAIL
- تحقق من Resend dashboard للأخطاء
```

### 5. خطأ 404 بعد الإطلاق
```
الحل: 
- اضغط Redeploy من Vercel
- تحقق من .next folder موجود
- تحقق من build command صحيح
```

---

## 📊 متغيرات البيئة الكاملة

### للـ Development المحلي (.env.local):
```
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRAPI_API_TOKEN=your_local_token
RESEND_API_KEY=your_resend_key
RESEND_FROM_EMAIL=noreply@localhost
```

### للـ Staging/Preview (Vercel):
```
NEXT_PUBLIC_STRAPI_URL=https://strapi-staging.yourcompany.com
NEXT_PUBLIC_APP_URL=https://yourdomain-staging.vercel.app
STRAPI_API_TOKEN=your_staging_token
RESEND_API_KEY=your_resend_staging_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### للـ Production (Vercel):
```
NEXT_PUBLIC_STRAPI_URL=https://strapi.yourcompany.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
STRAPI_API_TOKEN=your_production_token
RESEND_API_KEY=your_resend_production_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

---

## 🔐 نصائح الأمان

- ✅ لا تضع API keys في `.env.local` في الـ Repository
- ✅ استخدم tokens منفصلة لـ staging و production
- ✅ غير tokens كل 90 يوم
- ✅ استخدم الـ secrets من Vercel فقط
- ✅ راقب الـ logs للنشاط المريب
- ✅ فعّل 2FA على Vercel و Strapi

---

## 📞 الدعم والمراجع

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Strapi Cloud Docs](https://docs.strapi.io/cloud)
- [Resend Documentation](https://resend.com/docs)

---

**آخر تحديث:** 19 مايو 2026
**الحالة:** جاهز للإطلاق
