# ==============================================================================
# backup-db.ps1 — Backup do Postgres de produção (RoteiroApp)
# ------------------------------------------------------------------------------
# Gera um dump comprimido (.dump, formato custom do pg_dump) em ./backups,
# com timestamp, e apaga automaticamente os mais antigos (retenção).
#
# PRÉ-REQUISITOS
#   1) pg_dump instalado. Via Scoop:  scoop install postgresql
#   2) A URL PÚBLICA do banco (o host .railway.internal NÃO funciona de fora):
#      Railway → serviço postgres → Settings → Networking → habilite
#      "Public Networking" (TCP Proxy). Vai surgir a variável DATABASE_PUBLIC_URL
#      em Variables. Copie o valor.
#
# USO
#   # opção A — passar a URL direto:
#   .\scripts\backup-db.ps1 -DatabaseUrl "postgresql://user:pass@host:port/db"
#
#   # opção B — definir a variável de ambiente e rodar sem argumento:
#   $env:DATABASE_PUBLIC_URL = "postgresql://user:pass@host:port/db"
#   .\scripts\backup-db.ps1
#
# AGENDAR (semanal, Windows) — Agendador de Tarefas:
#   Programa:  powershell.exe
#   Argumentos: -ExecutionPolicy Bypass -File "D:\Projetos\Projetoclaudeviagem\scripts\backup-db.ps1"
#   (defina DATABASE_PUBLIC_URL como variável de ambiente do sistema)
#
# RESTAURAR um dump (teste periodicamente!):
#   pg_restore --clean --no-owner -d "URL_DE_UM_BANCO_VAZIO" .\backups\arquivo.dump
# ==============================================================================

param(
  [string]$DatabaseUrl = $env:DATABASE_PUBLIC_URL,
  [int]$RetainDays = 30
)

$ErrorActionPreference = "Stop"

# Aceita tambem DATABASE_URL como fallback (compatibilidade)
if (-not $DatabaseUrl) { $DatabaseUrl = $env:DATABASE_URL }

if (-not $DatabaseUrl) {
  Write-Host "ERRO: informe a URL do banco via -DatabaseUrl ou defina `$env:DATABASE_PUBLIC_URL." -ForegroundColor Red
  Write-Host "Pegue em: Railway > postgres > Settings > Networking > Public Networking (TCP Proxy)." -ForegroundColor Yellow
  exit 1
}

# Confere se o pg_dump esta disponivel
if (-not (Get-Command pg_dump -ErrorAction SilentlyContinue)) {
  Write-Host "ERRO: pg_dump nao encontrado no PATH. Instale com:  scoop install postgresql" -ForegroundColor Red
  exit 1
}

# Pasta de destino (fora do controle de versao — ver .gitignore)
$backupDir = Join-Path (Split-Path -Parent $PSScriptRoot) "backups"
if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }

$stamp = Get-Date -Format "yyyy-MM-dd_HHmm"
$outFile = Join-Path $backupDir "roteiroapp_$stamp.dump"

Write-Host "Gerando backup -> $outFile" -ForegroundColor Cyan
# -Fc = formato custom (comprimido, restauravel com pg_restore)
pg_dump $DatabaseUrl -Fc --no-acl --no-owner -f $outFile

if ($LASTEXITCODE -ne 0) {
  Write-Host "FALHA no pg_dump (exit $LASTEXITCODE)." -ForegroundColor Red
  exit $LASTEXITCODE
}

$sizeMB = [math]::Round((Get-Item $outFile).Length / 1MB, 2)
Write-Host "OK: backup criado ($sizeMB MB)." -ForegroundColor Green

# Retencao: apaga dumps mais antigos que $RetainDays
$cutoff = (Get-Date).AddDays(-$RetainDays)
$removed = 0
Get-ChildItem $backupDir -Filter "roteiroapp_*.dump" | Where-Object { $_.LastWriteTime -lt $cutoff } | ForEach-Object {
  Remove-Item $_.FullName -Force
  $removed++
}
if ($removed -gt 0) { Write-Host "Removidos $removed backup(s) com mais de $RetainDays dias." -ForegroundColor DarkGray }

Write-Host "Concluido." -ForegroundColor Green
