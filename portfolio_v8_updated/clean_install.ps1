cmd.exe /c "RMDIR /S /Q node_modules"
& "C:\Program Files\nodejs\npm.cmd" install --no-audit --no-fund
& "C:\Program Files\nodejs\npm.cmd" run dev
