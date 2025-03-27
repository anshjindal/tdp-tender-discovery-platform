@echo off

REM Reset remote origin
git remote remove origin
git remote add origin https://github.com/anshjindal/tdp-tender-discovery-platform
git remote set-url --add origin https://gitea.wouessi.com/Wouessi/tdp-tender-discovery-platform

echo Remotes configured. Git will push to GitHub first, then Gitea.
pause
