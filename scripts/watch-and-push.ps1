# watch-and-push.ps1
# Monitora alterações no projeto e faz commit + push automaticamente para o GitHub.
# Uso: powershell -ExecutionPolicy Bypass -File scripts\watch-and-push.ps1

$projectRoot = Split-Path $PSScriptRoot -Parent
$env:PATH = "$env:USERPROFILE\scoop\shims;$env:USERPROFILE\scoop\apps\nodejs-lts\current;$env:PATH"

Write-Host "🔍 Monitorando alterações em: $projectRoot" -ForegroundColor Cyan
Write-Host "   Pressione Ctrl+C para parar.`n" -ForegroundColor Gray

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $projectRoot
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true
$watcher.NotifyFilter = [System.IO.NotifyFilters]'FileName,DirectoryName,LastWrite'

# Ignorar pastas que não devem triggerar push
$ignoredPaths = @('node_modules', '.next', '.git', 'prisma\dev.db')

$debounceTimer = $null
$pendingPush = $false

$action = {
    $path = $Event.SourceEventArgs.FullPath

    foreach ($ignored in $ignoredPaths) {
        if ($path -like "*$ignored*") { return }
    }

    $script:pendingPush = $true
}

Register-ObjectEvent $watcher 'Changed' -Action $action | Out-Null
Register-ObjectEvent $watcher 'Created' -Action $action | Out-Null
Register-ObjectEvent $watcher 'Deleted' -Action $action | Out-Null
Register-ObjectEvent $watcher 'Renamed' -Action $action | Out-Null

while ($true) {
    Start-Sleep -Seconds 5

    if ($pendingPush) {
        $pendingPush = $false
        Start-Sleep -Seconds 3  # debounce: aguarda mais alterações

        Set-Location $projectRoot

        $status = git status --porcelain 2>&1
        if ($status) {
            $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            Write-Host "[$timestamp] Alterações detectadas — commitando..." -ForegroundColor Yellow

            git add .
            $msg = "chore: auto-sync $timestamp"
            git commit -m $msg 2>&1 | Out-Null
            git push origin main 2>&1

            Write-Host "[$timestamp] ✅ Push concluído para GitHub." -ForegroundColor Green
        }
    }
}
