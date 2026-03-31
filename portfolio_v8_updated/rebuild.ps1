$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
& "C:\Program Files\nodejs\npm.cmd" rebuild
& "C:\Program Files\nodejs\npm.cmd" run dev
