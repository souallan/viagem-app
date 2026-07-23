# gerar-keystore.ps1
# Gera a chave de assinatura (upload key) do app Android para a Google Play.
#
# Uso:  powershell -ExecutionPolicy Bypass -File scripts\gerar-keystore.ps1
#
# ┌─────────────────────────────────────────────────────────────────────────┐
# │ ATENÇÃO: PERDER ESTE ARQUIVO OU A SENHA = NUNCA MAIS ATUALIZAR O APP.  │
# │ Nem o Google recupera. Faça backup em pelo menos 2 lugares seguros.     │
# └─────────────────────────────────────────────────────────────────────────┘
#
# A senha é digitada AQUI, no seu computador, e não aparece na tela nem fica
# gravada em nenhum arquivo, log ou histórico.
#
# O keystore é gravado FORA do repositório (em Documentos), justamente para não
# ser commitado por acidente.

$ErrorActionPreference = "Stop"

# Garante o keytool no PATH (vem do JDK instalado via scoop)
$env:PATH = "$env:USERPROFILE\scoop\shims;$env:USERPROFILE\scoop\apps\temurin21-jdk\current\bin;$env:PATH"

if (-not (Get-Command keytool -ErrorAction SilentlyContinue)) {
    Write-Host "keytool nao encontrado. Instale o JDK:  scoop install temurin21-jdk" -ForegroundColor Red
    exit 1
}

$destino = Join-Path ([Environment]::GetFolderPath("MyDocuments")) "RoteiroApp-Chaves"
$arquivo = Join-Path $destino "upload-keystore.jks"

if (Test-Path $arquivo) {
    Write-Host ""
    Write-Host "JA EXISTE uma chave em: $arquivo" -ForegroundColor Yellow
    Write-Host "Gerar outra por cima tornaria o app publicado IMPOSSIVEL de atualizar." -ForegroundColor Yellow
    Write-Host "Se voce tem certeza de que quer recomecar, mova ou renomeie o arquivo antes." -ForegroundColor Yellow
    exit 1
}

New-Item -ItemType Directory -Force -Path $destino | Out-Null

Write-Host ""
Write-Host "=== Chave de assinatura do RoteiroApp ===" -ForegroundColor Cyan
Write-Host "Escolha uma senha FORTE e guarde-a junto do backup do arquivo."
Write-Host "Ela nao sera exibida enquanto voce digita."
Write-Host ""

$senha1 = Read-Host -AsSecureString "Senha da chave"
$senha2 = Read-Host -AsSecureString "Repita a senha"

$p1 = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($senha1))
$p2 = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($senha2))

if ($p1 -ne $p2) { Write-Host "As senhas nao conferem." -ForegroundColor Red; exit 1 }
if ($p1.Length -lt 8) { Write-Host "Use pelo menos 8 caracteres." -ForegroundColor Red; exit 1 }

# -dname preenchido: evita as perguntas interativas do keytool.
# CN = nome do app; O = titular. Estes dados NAO aparecem para o usuario final.
$dname = "CN=RoteiroApp, OU=RoteiroApp, O=RoteiroApp, L=Rio Branco, ST=AC, C=BR"

& keytool -genkeypair -v `
    -keystore $arquivo `
    -alias upload `
    -keyalg RSA `
    -keysize 2048 `
    -validity 10000 `
    -storepass $p1 `
    -keypass $p1 `
    -dname $dname

if ($LASTEXITCODE -ne 0) { Write-Host "Falha ao gerar a chave." -ForegroundColor Red; exit 1 }

# Base64 do keystore — é este texto que vai para o GitHub Secrets.
$b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes($arquivo))
$arquivoB64 = Join-Path $destino "upload-keystore.base64.txt"
[IO.File]::WriteAllText($arquivoB64, $b64)

# Impressão digital SHA-256 — usada depois no assetlinks.json (deep links).
Write-Host ""
Write-Host "=== Impressao digital SHA-256 (guarde) ===" -ForegroundColor Cyan
& keytool -list -v -keystore $arquivo -alias upload -storepass $p1 |
    Select-String "SHA256:" | ForEach-Object { $_.ToString().Trim() }

Write-Host ""
Write-Host "=== PRONTO ===" -ForegroundColor Green
Write-Host "Chave.......: $arquivo"
Write-Host "Base64......: $arquivoB64"
Write-Host ""
Write-Host "AGORA, NESTA ORDEM:" -ForegroundColor Yellow
Write-Host "  1. Faca BACKUP da pasta $destino em 2 lugares seguros"
Write-Host "     (ex.: Google Drive privado + pendrive). Guarde a senha junto."
Write-Host "  2. No GitHub (repo viagem-app - Settings - Secrets and variables - Actions),"
Write-Host "     crie os secrets:"
Write-Host "       ANDROID_KEYSTORE_BASE64   = todo o conteudo de upload-keystore.base64.txt"
Write-Host "       ANDROID_KEYSTORE_PASSWORD = a senha que voce acabou de escolher"
Write-Host "       ANDROID_KEY_ALIAS         = upload"
Write-Host "       ANDROID_KEY_PASSWORD      = a mesma senha"
Write-Host "  3. Apague o upload-keystore.base64.txt depois de colar no GitHub."
Write-Host "     (o .jks voce MANTEM, guardado no backup)"
Write-Host ""
