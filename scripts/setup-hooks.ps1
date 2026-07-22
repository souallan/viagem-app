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

# ATENÇÃO: não usar Set-Content/Out-File aqui.
# No Windows PowerShell 5.1, `-Encoding utf8` grava UTF-8 COM BOM e o BOM fica ANTES
# do shebang — o kernel não consegue mais resolver o interpretador e o git falha com
# "cannot spawn .git/hooks/post-commit: No such file or directory" (mensagem enganosa:
# o que não é encontrado é o /bin/sh, não o hook). CRLF no shebang quebra do mesmo
# jeito. Por isso: LF explícito + UTF-8 sem BOM.
$hookContent = $hookContent -replace "`r`n", "`n"
[System.IO.File]::WriteAllText($hookPath, $hookContent, (New-Object System.Text.UTF8Encoding($false)))
Write-Host "✅ Hook post-commit instalado em: $hookPath" -ForegroundColor Green
Write-Host "   A cada 'git commit', o push para o GitHub será automático." -ForegroundColor Cyan
