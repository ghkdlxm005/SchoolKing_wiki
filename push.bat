@echo off
rem ============================================
rem SchoolKing wiki - one-click commit & push
rem Double-click this file to upload changes.
rem ============================================
cd /d "%~dp0"

git add -A
git commit -m "wiki update %date% %time%"
git push

echo.
echo ==========================================
echo  Push done! Site updates in 1-2 minutes:
echo  https://ghkdlxm005.github.io/SchoolKing_wiki/
echo ==========================================
pause
