@echo off
chcp 65001 >nul
echo ========================================================
echo    جاري رفع متجر Fashion Hanin إلى GitHub Pages...
echo ========================================================
cd /d "%~dp0"
git config user.name "Gt2433"
git config user.email "gt2433@users.noreply.github.com"
git add .
git commit -m "Deploy Fashion Hanin Store to GitHub Pages"
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/Gt2433/stores.git
echo.
echo جاري النشر واستبدال المحتوى في المستودع...
git push -f origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo  ✅ تم الرفع بنجاح!
    echo  🌐 رابط متجرك المباشر: https://gt2433.github.io/stores/
    echo  ⚙️ رابط لوحة التحكم: https://gt2433.github.io/stores/admin.html
    echo ========================================================
) else (
    echo ❌ حدث خطأ أثناء الرفع، يرجى التأكد من تسجيل الدخول إلى GitHub.
)
pause
