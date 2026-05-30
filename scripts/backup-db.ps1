# RoteiroApp — Backup manual do PostgreSQL (Railway)
# Uso: .\scripts\backup-db.ps1
# Requer: pg_dump instalado (PostgreSQL client tools)

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$backupFile = "backup_roteiroapp_$timestamp.sql"
$backupDir  = "$PSScriptRoot\..\backups"

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir | Out-Null
}

# DATABASE_URL do Railway (production)
# Substitua pelo valor em railway.com > roteiroapp > postgres > Variables > DATABASE_URL
$databaseUrl = $env:DATABASE_URL
if (-not $databaseUrl) {
    Write-Error "DATABASE_URL não definido. Execute: `$env:DATABASE_URL = 'postgresql://...'"
    exit 1
}

Write-Host "Iniciando backup: $backupFile"
pg_dump $databaseUrl --format=plain --no-acl --no-owner --file="$backupDir\$backupFile"

if ($LASTEXITCODE -eq 0) {
    $size = (Get-Item "$backupDir\$backupFile").Length / 1KB
    Write-Host "Backup concluido: $backupDir\$backupFile ($([math]::Round($size, 1)) KB)"
} else {
    Write-Error "Falha no backup. Verifique se pg_dump esta instalado e o DATABASE_URL esta correto."
}
