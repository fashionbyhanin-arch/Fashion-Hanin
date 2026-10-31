@echo off
chcp 65001 >nul
echo ========================================================
echo    جاري رفع متجر Fashion Hanin إلى GitHub Pages...
echo ========================================================
cd /d "%~dp0"
git config user.name "fashionbyhanin-arch"
git config user.email "fashionbyhanin-arch@users.noreply.github.com"
git add .
git commit -m "Deploy Fashion Hanin Store to GitHub Pages"
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/fashionbyhanin-arch/Fashion-Hanin.git
echo.
echo جاري النشر واستبدال المحتوى في المستودع...
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo  ✅ تم الرفع بنجاح!
    echo  📁 المستودع: https://github.com/fashionbyhanin-arch/Fashion-Hanin
    echo  🌐 رابط متجرك المباشر: https://fashionbyhanin-arch.github.io/Fashion-Hanin/
    echo  ⚙️ رابط لوحة التحكم: https://fashionbyhanin-arch.github.io/Fashion-Hanin/admin.html
    echo ========================================================
) else (
    echo ❌ حدث خطأ أثناء الرفع، يرجى التأكد من تسجيل الدخول إلى GitHub.
)
pause
