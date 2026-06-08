#!/bin/bash
# 🚀 سكريبت الإطلاق السريع (Quick Deployment Script)
# استخدم: bash deploy.sh

echo "=========================================="
echo "  🚀 سكريبت الإطلاق السريع لـ TechnoStore"
echo "=========================================="
echo ""

# ألوان للطباعة
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# دالة للطباعة الملونة
print_status() {
  echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
  echo -e "${RED}❌ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

# 1️⃣ التحقق من Node.js و npm
echo "1️⃣  التحقق من المتطلبات الأساسية..."
if ! command -v node &> /dev/null; then
  print_error "Node.js غير مثبت!"
  exit 1
fi
print_status "Node.js موجود: $(node -v)"

if ! command -v npm &> /dev/null; then
  print_error "npm غير مثبت!"
  exit 1
fi
print_status "npm موجود: $(npm -v)"

# 2️⃣ التحقق من .env.local
echo ""
echo "2️⃣  التحقق من ملف البيئة..."
if [ ! -f .env.local ]; then
  print_error ".env.local غير موجود!"
  print_warning "انسخ .env.example إلى .env.local وعبّأ القيم"
  exit 1
fi
print_status ".env.local موجود"

# التحقق من المتغيرات المهمة
if grep -q "NEXT_PUBLIC_STRAPI_URL" .env.local; then
  print_status "NEXT_PUBLIC_STRAPI_URL موجود"
else
  print_error "NEXT_PUBLIC_STRAPI_URL غير موجود في .env.local"
  exit 1
fi

# 3️⃣ تنظيف المكتبات القديمة
echo ""
echo "3️⃣  تنظيف المكتبات القديمة..."
rm -rf node_modules/.bin
rm -rf .next
print_status "تم التنظيف"

# 4️⃣ تثبيت الاعتماديات
echo ""
echo "4️⃣  تثبيت الاعتماديات..."
npm install
if [ $? -ne 0 ]; then
  print_error "فشل تثبيت الاعتماديات!"
  exit 1
fi
print_status "تم تثبيت الاعتماديات"

# 5️⃣ فحص التصريح
echo ""
echo "5️⃣  فحص الأخطاء..."
npm run lint 2>/dev/null || print_warning "قد توجد تحذيرات lint"

# 6️⃣ البناء
echo ""
echo "6️⃣  بناء المشروع..."
npm run build
if [ $? -ne 0 ]; then
  print_error "فشل البناء!"
  exit 1
fi
print_status "تم البناء بنجاح!"

# 7️⃣ الاختبار المحلي
echo ""
echo "7️⃣  جاهز للاختبار المحلي..."
print_status "قم بتشغيل: npm run dev"
print_status "ثم افتح: http://localhost:3000"

echo ""
echo "=========================================="
echo "✅ كل شيء جاهز للإطلاق!"
echo "=========================================="
echo ""
echo "الخطوة التالية:"
echo "1. تأكد من جميع المتغيرات في Vercel"
echo "2. اضغط Deploy على Vercel"
echo "3. انتظر البناء (~3-5 دقائق)"
echo "4. اختبر الموقع النهائي"
echo ""
