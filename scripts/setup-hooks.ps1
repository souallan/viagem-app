# setup-hooks.ps1
# Instala o git hook post-commit que faz push automático após cada commit manual.
# Uso: powershell -ExecutionPolicy Bypass -File scripts\setup-hooks.ps1

$hookPath = Join-Path $PSScriptRoot "..\\.git\\hooks\\post-commit"
$hookPath = [System.IO.Path]::GetFullPath($hookPath)

$hookContent = @'
#!/bin/sh
# Auto-push to GitHub after every commit
echo "Auto-pushing to GitHub..."
git push origin main
'@

Set-Content -Path $hookPath -Value $hookContent -Encoding utf8
Write-Host "✅ Hook post-commit instalado em: $hookPath" -ForegroundColor Green
Write-Host "   A cada 'git commit', o push para o GitHub será automático." -ForegroundColor Cyan
