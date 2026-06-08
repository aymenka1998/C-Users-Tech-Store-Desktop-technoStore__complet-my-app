@echo off
REM 🚀 سكريبت الإطلاق السريع (Quick Deployment Script)
REM استخدم: deploy.bat

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo   🚀 سكريبت الإطلاق السريع لـ TechnoStore
echo ==========================================
echo.

REM 1️⃣ التحقق من Node.js و npm
echo 1️⃣  التحقق من المتطلبات الأساسية...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo ❌ Node.js غير مثبت!
  exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✅ Node.js موجود: %NODE_VERSION%

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo ❌ npm غير مثبت!
  exit /b 1
)
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✅ npm موجود: %NPM_VERSION%

REM 2️⃣ التحقق من .env.local
echo.
echo 2️⃣  التحقق من ملف البيئة...
if not exist .env.local (
  echo ❌ .env.local غير موجود!
  echo ⚠️  انسخ .env.example إلى .env.local وعبّأ القيم
  exit /b 1
)
echo ✅ .env.local موجود

REM التحقق من المتغيرات المهمة
findstr /M "NEXT_PUBLIC_STRAPI_URL" .env.local >nul
if %ERRORLEVEL% NEQ 0 (
  echo ❌ NEXT_PUBLIC_STRAPI_URL غير موجود في .env.local
  exit /b 1
)
echo ✅ NEXT_PUBLIC_STRAPI_URL موجود

REM 3️⃣ تنظيف المكتبات القديمة
echo.
echo 3️⃣  تنظيف المكتبات القديمة...
if exist node_modules rmdir /s /q node_modules 2>nul
if exist .next rmdir /s /q .next 2>nul
echo ✅ تم التنظيف

REM 4️⃣ تثبيت الاعتماديات
echo.
echo 4️⃣  تثبيت الاعتماديات...
call npm install
if %ERRORLEVEL% NEQ 0 (
  echo ❌ فشل تثبيت الاعتماديات!
  exit /b 1
)
echo ✅ تم تثبيت الاعتماديات

REM 5️⃣ البناء
echo.
echo 5️⃣  بناء المشروع...
call npm run build
if %ERRORLEVEL% NEQ 0 (
  echo ❌ فشل البناء!
  exit /b 1
)
echo ✅ تم البناء بنجاح!

REM 6️⃣ الاختبار المحلي
echo.
echo 6️⃣  جاهز للاختبار المحلي...
echo ✅ قم بتشغيل: npm run dev
echo ✅ ثم افتح: http://localhost:3000

echo.
echo ==========================================
echo ✅ كل شيء جاهز للإطلاق!
echo ==========================================
echo.
echo الخطوة التالية:
echo 1. تأكد من جميع المتغيرات في Vercel
echo 2. اضغط Deploy على Vercel
echo 3. انتظر البناء (~3-5 دقائق)
echo 4. اختبر الموقع النهائي
echo.

pause
