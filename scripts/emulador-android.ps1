# emulador-android.ps1
# Sobe o emulador Android para testar o app (útil para quem não tem aparelho Android).
#
# Uso:
#   powershell -ExecutionPolicy Bypass -File scripts\emulador-android.ps1
#   powershell -ExecutionPolicy Bypass -File scripts\emulador-android.ps1 -InstalarApk
#
# Pré-requisito (UMA VEZ, COMO ADMINISTRADOR):
#   O emulador precisa do driver de virtualização. Em CPU AMD é o AEHD.
#   Abra o PowerShell COMO ADMINISTRADOR e rode:
#     & "$env:USERPROFILE\scoop\apps\android-clt\current\extras\google\Android_Emulator_Hypervisor_Driver\silent_install.bat"
#   Sem isso o emulador falha com "hypervisor driver is not installed".

param(
    [switch]$InstalarApk,   # instala o APK de Downloads assim que o sistema subir
    [switch]$Offline        # sobe já sem rede, para testar o modo offline
)

$ErrorActionPreference = "Stop"

$env:ANDROID_HOME     = "$env:USERPROFILE\scoop\apps\android-clt\current"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
$emu = "$env:ANDROID_HOME\emulator\emulator.exe"
$adb = "$env:ANDROID_HOME\platform-tools\adb.exe"

if (-not (Test-Path $emu)) { Write-Host "Emulador nao instalado." -ForegroundColor Red; exit 1 }

# Sem o driver, o emulador nao sobe — avisa com o comando exato em vez de falhar seco.
& $emu -accel-check 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "FALTA O DRIVER DE VIRTUALIZACAO." -ForegroundColor Yellow
    Write-Host "Abra o PowerShell COMO ADMINISTRADOR e rode:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  & `"$env:ANDROID_HOME\extras\google\Android_Emulator_Hypervisor_Driver\silent_install.bat`""
    Write-Host ""
    Write-Host "Depois rode este script de novo." -ForegroundColor Yellow
    exit 1
}

$jaRodando = Get-Process -Name "qemu-system*" -ErrorAction SilentlyContinue
if (-not $jaRodando) {
    Write-Host "Subindo o emulador..." -ForegroundColor Cyan
    $args = @("-avd", "roteiroapp", "-no-snapshot-load", "-no-boot-anim")
    if ($Offline) { $args += "-netdelay"; $args += "none"; $args += "-netspeed"; $args += "gsm" }
    Start-Process -FilePath $emu -ArgumentList $args
} else {
    Write-Host "Emulador ja esta rodando." -ForegroundColor Green
}

Write-Host "Aguardando o Android terminar de iniciar (pode levar 1-2 min na 1a vez)..."
$pronto = $false
for ($i = 0; $i -lt 60; $i++) {
    Start-Sleep -Seconds 5
    $b = (& $adb shell getprop sys.boot_completed 2>$null | Out-String).Trim()
    if ($b -eq "1") { $pronto = $true; break }
}

if (-not $pronto) { Write-Host "O sistema nao terminou de iniciar a tempo." -ForegroundColor Yellow; exit 1 }
Write-Host "Android pronto." -ForegroundColor Green

if ($InstalarApk) {
    $apk = Join-Path $env:USERPROFILE "Downloads\roteiroapp-apk\app-debug.apk"
    if (-not (Test-Path $apk)) { Write-Host "APK nao encontrado em $apk" -ForegroundColor Red; exit 1 }
    Write-Host "Instalando o APK..." -ForegroundColor Cyan
    & $adb install -r $apk
    Write-Host "Abrindo o RoteiroApp..." -ForegroundColor Cyan
    & $adb shell monkey -p com.roteiroapp.app -c android.intent.category.LAUNCHER 1 | Out-Null
}

Write-Host ""
Write-Host "=== COMANDOS UTEIS ===" -ForegroundColor Cyan
Write-Host "Instalar/atualizar o app:  adb install -r <caminho do apk>"
Write-Host "Ver os logs do app......:  adb logcat | Select-String roteiroapp"
Write-Host "SIMULAR MODO AVIAO......:  adb shell svc wifi disable; adb shell svc data disable"
Write-Host "Voltar a ter internet...:  adb shell svc wifi enable;  adb shell svc data enable"
Write-Host "Botao VOLTAR do Android.:  adb shell input keyevent KEYCODE_BACK"
Write-Host "Tirar print da tela.....:  adb exec-out screencap -p > tela.png"
Write-Host ""
Write-Host "(adb fica em: $adb)"
