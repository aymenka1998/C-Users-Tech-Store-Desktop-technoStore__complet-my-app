# 🚀 قائمة التحقق قبل الإطلاق (Pre-Deployment Checklist)

## تاريخ الإطلاق المخطط: _______________

---

## المرحلة 1️⃣: التحقق المحلي (Development)

### كود و الاعتماديات
- [ ] `npm install` تم بنجاح (لا توجد أخطاء)
- [ ] `npm run build` تم بنجاح بدون أخطاء TypeScript
- [ ] `npm run dev` يعمل على localhost:3000
- [ ] `npm run lint` بدون تحذيرات حرجة

### المتغيرات المحلية
- [ ] `.env.local` موجود ومعبأ بقيم صحيحة
- [ ] `.env.local` **ليس** في Git (في .gitignore)
- [ ] `NEXT_PUBLIC_STRAPI_URL` تشير لـ localhost:1337 (للاختبار المحلي)
- [ ] جميع الـ secrets موجودة

### الاختبارات الوظيفية
- [ ] الصفحة الرئيسية تعمل بدون أخطاء
- [ ] المنتجات تحمّل من Strapi بنجاح
- [ ] التصنيفات تعمل بشكل صحيح
- [ ] تسجيل المستخدم يعمل
- [ ] تسجيل الدخول يعمل
- [ ] السلة تحفظ البيانات محلياً
- [ ] البحث يعمل

### اختبار API
- [ ] `GET /api/products` يعود بيانات صحيحة
- [ ] `GET /api/categories` يعود بيانات صحيحة
- [ ] جميع endpoints لا تعود 500 errors

---

## المرحلة 2️⃣: التحضير على Vercel

### حساب Vercel
- [ ] حساب Vercel تم إنشاؤه
- [ ] GitHub متصل بـ Vercel
- [ ] Repository موجود وقابل للوصول

### Repository على GitHub
- [ ] Code دفع (push) للفرع الرئيسي (main/master)
- [ ] `.env.local` ليس في Git
- [ ] `.env.example` موجود مع قيم placeholder
- [ ] جميع الملفات المطلوبة موجودة:
  - [ ] `package.json`
  - [ ] `next.config.ts`
  - [ ] `tsconfig.json`
  - [ ] `vercel.json`

---

## المرحلة 3️⃣: إعدادات Strapi Cloud

### إنشاء Project
- [ ] Strapi Cloud project موجود وـ online
- [ ] URL الـ Strapi جاهزة (مثال: `yourproject.strapi.cloud`)
- [ ] Database متصل وفيه بيانات اختبار

### API Configuration
- [ ] قاعدة بيانات مع عينات المنتجات موجودة
- [ ] فورة data (seed data) موجودة:
  - [ ] 10+ منتجات
  - [ ] 3+ تصنيفات
  - [ ] 2+ مستخدمين اختبار

### API Tokens
- [ ] Token جديد `Vercel Production` تم الإنشاء
  - [ ] اسم: "Vercel Production"
  - [ ] نوع: Custom
  - [ ] مدة: 90 days
  - [ ] صلاحيات: Read on Products و Categories
  - [ ] Token منسوخ وآمن
- [ ] Token قديم تم الحذف أو التعطيل

### CORS Settings
- [ ] CORS مفعّل للـ Origin الجديد
  - [ ] `https://yourdomain.vercel.app` مضافة
  - [ ] `https://yourdomain.com` مضافة (إن كان domain مخصص)

---

## المرحلة 4️⃣: إعدادات Resend

### حساب Resend
- [ ] Resend Dashboard يعمل
- [ ] API Key موجودة وصحيحة
- [ ] Domain متحقق منه:
  - [ ] DNS records مضافة
  - [ ] SPF record موجود
  - [ ] DKIM record موجود
  - [ ] DMARC record موجود (optional)

### البريد الإلكتروني
- [ ] Sending domain: `noreply@yourdomain.com`
- [ ] اختبار: إرسال بريد تجريبي من Resend dashboard ✅
- [ ] العنوان البديل موثق (إن وجد)

---

## المرحلة 5️⃣: إعدادات Vercel

### Project Creation
- [ ] New Project تم الإنشاء على Vercel
- [ ] GitHub repo موصول بنجاح
- [ ] إعدادات البناء صحيحة:
  - [ ] Framework: Next.js
  - [ ] Build Command: `npm run build`
  - [ ] Install Command: `npm install`
  - [ ] Output Directory: `.next`

### Environment Variables - Production
```
أضف هذه المتغيرات مع اختيار "Production" فقط:
```
- [ ] `STRAPI_API_TOKEN` = [من Strapi] (Production فقط)
- [ ] `RESEND_API_KEY` = [من Resend] (Production فقط)

### Environment Variables - Production + Preview
```
أضف هذه المتغيرات مع اختيار "Production + Preview":
```
- [ ] `NEXT_PUBLIC_STRAPI_URL` = `https://yourproject.strapi.cloud`
- [ ] `NEXT_PUBLIC_APP_URL` = `https://yourdomain.vercel.app`
- [ ] `RESEND_FROM_EMAIL` = `noreply@yourdomain.com`

### Domain (اختياري)
- [ ] إذا كان domain مخصص:
  - [ ] DNS records مضافة
  - [ ] Domain متحقق منه على Vercel
  - [ ] SSL certificate متفعّل (تلقائي)

---

## المرحلة 6️⃣: الاختبار على Staging

### First Deployment
- [ ] Initial deployment من Vercel (بعد Import)
- [ ] Build اكتمل بنجاح (0 errors)
- [ ] Preview URL شغّال: `https://yourdomain.vercel.app`

### اختبارات البيانات
- [ ] Homepage تحمّل:
  - [ ] صور الـ hero تظهر
  - [ ] المنتجات المميزة تظهر
  - [ ] التصنيفات تظهر
- [ ] صفحة المنتجات:
  - [ ] المنتجات تحمّل من Strapi
  - [ ] الفلترة تعمل
  - [ ] الترتيب يعمل
  - [ ] الصور تظهر بشكل صحيح
- [ ] صفحة التصنيفات:
  - [ ] التصنيفات تعرض بشكل صحيح
  - [ ] النقر على التصنيف يعمل

### اختبارات المستخدم
- [ ] تسجيل مستخدم جديد:
  - [ ] النموذج يقبل البيانات
  - [ ] بريد الترحيب يصل خلال 2 دقيقة
  - [ ] المستخدم يمكنه تسجيل الدخول
- [ ] تسجيل الدخول:
  - [ ] بريد + كلمة مرور صحيحة → نجح
  - [ ] بيانات خاطئة → فشل مع رسالة
- [ ] نسيان كلمة المرور:
  - [ ] رابط إعادة تعيين يصل بالبريد
  - [ ] إعادة التعيين تعمل

### اختبارات الأمان
- [ ] HTTPS مفعّل (عنوان آمن)
- [ ] Security headers موجودة:
  ```bash
  curl -I https://yourdomain.vercel.app
  # يجب أن ترى X-Content-Type-Options, X-Frame-Options, إلخ
  ```
- [ ] JWT cookies HTTP-only (آمن)
- [ ] لا توجد secrets في الـ logs

---

## المرحلة 7️⃣: الإطلاق النهائي على Production

### التأكيد النهائي
- [ ] جميع الاختبارات السابقة نجحت ✅
- [ ] لا توجد أخطاء في logs
- [ ] Performance جيد (الصفحات تحمّل < 3 ثوان)
- [ ] Mobile responsive يعمل
- [ ] جميع الفريق أعطى approval

### Production Deployment
- [ ] Production branch selected: `main` أو `master`
- [ ] اضغط **Promote to Production** من Vercel
  - أو: دفع (push) إلى main branch يؤدي لإطلاق تلقائي
- [ ] انتظر البناء النهائي (~3-5 دقائق)
- [ ] اختبر الـ production URL

### Post-Launch Verification
- [ ] Homepage تحمّل بنجاح
- [ ] جميع الروابط تعمل
- [ ] صور تظهر بشكل صحيح
- [ ] البريد يصل (اختبر تسجيل جديد)
- [ ] API endpoints تجيب بشكل صحيح
- [ ] لا توجد errors في Vercel logs

---

## المرحلة 8️⃣: المراقبة بعد الإطلاق

### اليوم الأول (24 ساعة)
- [ ] راقب Vercel logs للأخطاء
- [ ] راقب Strapi logs
- [ ] راقب Resend logs للبريد
- [ ] اختبر وظائف المستخدم الأساسية يومياً

### الأسبوع الأول
- [ ] تحقق من Performance (Vercel Analytics)
- [ ] تحقق من عدد الأخطاء (Error Tracking)
- [ ] اختبر جميع النوافذ
- [ ] اختبر على أجهزة مختلفة (desktop, tablet, mobile)

### المتابعة المستمرة
- [ ] مراجعة logs أسبوعية
- [ ] update dependencies شهرياً
- [ ] تجديد API tokens كل 90 يوم
- [ ] Backups من Strapi database

---

## 🆘 Emergency Response Plan

### إذا حدثت مشكلة في Production:

1. **فوري:**
   ```
   ✅ اضغط Rollback في Vercel إلى deployment السابق
   ✅ راقب logs للأخطاء
   ✅ تحقق من status.vercel.com للأعطال العام
   ```

2. **تشخيص:**
   ```
   ✅ افحص Vercel logs
   ✅ افحص Strapi logs
   ✅ افحص Resend logs
   ✅ جرب الموقع بـ incognito mode
   ```

3. **الحل:**
   ```
   ✅ أصلح المشكلة محلياً
   ✅ اختبر بناء محلي
   ✅ dفع (push) لـ development branch
   ✅ اختبر على staging أولاً
   ✅ merge لـ main عند التأكد
   ✅ Vercel يطلق تلقائياً
   ```

---

## 📋 Resources الضرورية

### Documentation
- [ ] SECURITY.md - قرأها المطورون
- [ ] DEPLOYMENT_CHECKLIST.md - تم إتمامه
- [ ] VERCEL_SETUP.md - مرجع العملية
- [ ] ENV_VARIABLES_REFERENCE.md - للمتغيرات

### Accounts & Access
- [ ] جميع الفريق لهم وصول لـ:
  - [ ] GitHub repo
  - [ ] Vercel dashboard
  - [ ] Strapi Cloud
  - [ ] Resend dashboard
- [ ] اسم مستخدم وكلمة مرور آمنة مخزنة

### Monitoring Tools (Optional)
- [ ] Sentry: لـ error tracking
- [ ] LogRocket: لـ session replay
- [ ] Vercel Analytics: لـ performance
- [ ] Uptime monitor: لـ availability

---

## ✍️ التوقيع والتاريخ

| الدور | الاسم | التوقيع | التاريخ |
|------|------|---------|--------|
| Dev Lead | __________ | __________ | __________ |
| QA Lead | __________ | __________ | __________ |
| Product Owner | __________ | __________ | __________ |

---

## 📞 جهات الاتصال الطوارئ

| الدور | الاسم | الهاتف | البريد |
|------|------|--------|--------|
| On-Call Dev | __________ | __________ | __________ |
| DevOps | __________ | __________ | __________ |
| Support | __________ | __________ | __________ |

---

**آخر تحديث:** 19 مايو 2026
**الحالة:** جاهز للإطلاق
