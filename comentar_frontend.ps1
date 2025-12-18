# ============================================================================
# SCRIPT DE DOCUMENTACIÓN AUTOMÁTICA DEL FRONTEND
# ============================================================================
# 
# @file comentar_frontend.ps1
# @description Script para agregar comentarios profesionales a todos los
#              archivos del frontend del proyecto
# @author Dennis Moises Ccapatinta Qqueccaño
# @date 2024-12-18
#
# INSTRUCCIONES:
# 1. Abre PowerShell como Administrador
# 2. Navega a: cd C:\Users\Pxpxd\Downloads\Plataforma-de-Denuncias--main
# 3. Ejecuta: powershell -ExecutionPolicy Bypass -File comentar_frontend.ps1
#
# ============================================================================

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " SCRIPT DE DOCUMENTACIÓN FRONTEND" -ForegroundColor Cyan
Write-Host " Autor: Dennis Ccapatinta" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Función para agregar header a archivos JSX
function Add-JSXHeader {
    param (
        [string]$FilePath,
        [string]$ComponentName,
        [string]$Description
    )
    
    $header = @"
/**
 * ============================================================================
 * $ComponentName
 * ============================================================================
 * 
 * @file $(Split-Path -Leaf $FilePath)
 * @description $Description
 * 
 * @author Dennis Moises Ccapatinta Qqueccaño - 140984
 * @date 2024-12-18
 * @proyecto Plataforma de Denuncias Ciudadanas
 * @version 2.0.0
 * 
 * @responsabilidades
 * - Desarrollo completo del frontend
 * - Implementación de componentes React
 * - Diseño de interfaces de usuario
 * - Integración con API REST
 * 
 * ============================================================================
 */

"@
    
    $content = Get-Content $FilePath -Raw -ErrorAction SilentlyContinue
    
    if ($content -and -not ($content -match "@author Dennis")) {
        $newContent = $header + $content
        Set-Content -Path $FilePath -Value $newContent -Encoding UTF8
        Write-Host "[✓] Documentado: $(Split-Path -Leaf $FilePath)" -ForegroundColor Green
        return $true
    } else {
        Write-Host "[~] Ya documentado: $(Split-Path -Leaf $FilePath)" -ForegroundColor Yellow
        return $false
    }
}

# Función para agregar header a archivos CSS
function Add-CSSHeader {
    param (
        [string]$FilePath,
        [string]$ComponentName
    )
    
    $header = @"
/**
 * ============================================================================
 * ESTILOS: $ComponentName
 * ============================================================================
 * 
 * @file $(Split-Path -Leaf $FilePath)
 * @author Dennis Moises Ccapatinta Qqueccaño - 140984
 * @date 2024-12-18
 * 
 * @description
 * Hoja de estilos que define la apariencia visual y comportamiento responsive
 * del componente $ComponentName
 * 
 * @enfoque Mobile-First
 * @paleta Basada en variables CSS del sistema de diseño unificado
 * 
 * ============================================================================
 */

"@
    
    $content = Get-Content $FilePath -Raw -ErrorAction SilentlyContinue
    
    if ($content -and -not ($content -match "@author Dennis")) {
        $newContent = $header + $content
        Set-Content -Path $FilePath -Value $newContent -Encoding UTF8
        Write-Host "[✓] Documentado CSS: $(Split-Path -Leaf $FilePath)" -ForegroundColor Green
        return $true
    }
    return $false
}

# Contador
$totalFiles = 0
$documentedFiles = 0

# COMPONENTES PRINCIPALES
Write-Host "`n📁 Documentando componentes de autenticación..." -ForegroundColor Cyan

$authComponents = @(
    @{Path="src\components\auth\LoginForm\LoginForm.jsx"; Name="COMPONENTE DE FORMULARIO DE LOGIN"; Desc="Formulario de inicio de sesión con validación de credenciales y manejo de errores"}
    @{Path="src\components\auth\RegisterForm\RegisterForm.jsx"; Name="COMPONENTE DE FORMULARIO DE REGISTRO"; Desc="Formulario de registro de nuevos usuarios ciudadanos con validación de datos"}
)

foreach ($comp in $authComponents) {
    $fullPath = Join-Path $PSScriptRoot $comp.Path
    if (Test-Path $fullPath) {
        $totalFiles++
        if (Add-JSXHeader -FilePath $fullPath -ComponentName $comp.Name -Description $comp.Desc) {
            $documentedFiles++
        }
    }
}

# COMPONENTES COMUNES
Write-Host "`n📁 Documentando componentes comunes..." -ForegroundColor Cyan

$commonComponents = @(
    @{Path="src\components\common\Button\Button.jsx"; Name="COMPONENTE BUTTON REUTILIZABLE"; Desc="Botón personalizado con múltiples variantes (primary, secondary, danger, outline) y estados (loading, disabled)"}
    @{Path="src\components\common\Input\Input.jsx"; Name="COMPONENTE INPUT REUTILIZABLE"; Desc="Campo de entrada de texto con validación, soporte para diferentes tipos y manejo de errores"}
    @{Path="src\components\common\Alert\Alert.jsx"; Name="COMPONENTE DE ALERTAS"; Desc="Sistema de alertas con diferentes niveles (success, error, warning, info) y cierre automático"}
    @{Path="src\components\common\Loading\Loading.jsx"; Name="COMPONENTE DE CARGA"; Desc="Indicador de carga animado para mejorar la experiencia de usuario durante operaciones asíncronas"}
    @{Path="src\components\common\Header\Header.jsx"; Name="COMPONENTE HEADER PRINCIPAL"; Desc="Cabecera de la aplicación con navegación, logo y menú de usuario"}
    @{Path="src\components\common\Navigation\Navigation.jsx"; Name="COMPONENTE DE NAVEGACIÓN"; Desc="Menú de navegación lateral con rutas organizadas por rol de usuario"}
)

foreach ($comp in $commonComponents) {
    $fullPath = Join-Path $PSScriptRoot $comp.Path
    if (Test-Path $fullPath) {
        $totalFiles++
        if (Add-JSXHeader -FilePath $fullPath -ComponentName $comp.Name -Description $comp.Desc) {
            $documentedFiles++
        }
    }
}

# PÁGINAS
Write-Host "`n📁 Documentando páginas..." -ForegroundColor Cyan

$pages = @(
    @{Path="src\pages\ciudadano\HomePage\HomePage.jsx"; Name="PÁGINA DASHBOARD CIUDADANO"; Desc="Dashboard principal del ciudadano con resumen de denuncias, estadísticas y accesos rápidos"}
    @{Path="src\pages\ciudadano\DenunciasPage\DenunciasPage.jsx"; Name="PÁGINA DE LISTA DE DENUNCIAS"; Desc="Vista completa de denuncias del ciudadano con filtros, búsqueda y paginación"}
    @{Path="src\pages\ciudadano\NuevaDenunciaPage\NuevaDenunciaPage.jsx"; Name="PÁGINA DE NUEVA DENUNCIA"; Desc="Formulario completo para crear una nueva denuncia con geolocalización y evidencias fotográficas"}
    @{Path="src\pages\auth\LoginPage\LoginPage.jsx"; Name="PÁGINA DE LOGIN"; Desc="Página de inicio de sesión con formulario de autenticación y recuperación de contraseña"}
    @{Path="src\pages\auth\RegisterPage\RegisterPage.jsx"; Name="PÁGINA DE REGISTRO"; Desc="Página de registro de nuevos usuarios con validación completa"}
)

foreach ($page in $pages) {
    $fullPath = Join-Path $PSScriptRoot $page.Path
    if (Test-Path $fullPath) {
        $totalFiles++
        if (Add-JSXHeader -FilePath $fullPath -ComponentName $page.Name -Description $page.Desc) {
            $documentedFiles++
        }
    }
}

# SERVICIOS Y CONTEXTOS
Write-Host "`n📁 Documentando servicios y contextos..." -ForegroundColor Cyan

$services = @(
    @{Path="src\services\authService.js"; Name="SERVICIO DE AUTENTICACIÓN"; Desc="Servicio para gestión de autenticación JWT, login, registro y recuperación de contraseña"}
    @{Path="src\services\denunciaService.js"; Name="SERVICIO DE DENUNCIAS"; Desc="Servicio para CRUD completo de denuncias, categorías y estados"}
    @{Path="src\contexts\AuthContext.jsx"; Name="CONTEXTO DE AUTENTICACIÓN GLOBAL"; Desc="Proveedor de estado global para autenticación y datos de usuario"}
)

foreach ($svc in $services) {
    $fullPath = Join-Path $PSScriptRoot $svc.Path
    if (Test-Path $fullPath) {
        $totalFiles++
        if (Add-JSXHeader -FilePath $fullPath -ComponentName $svc.Name -Description $svc.Desc) {
            $documentedFiles++
        }
    }
}

# DOCUMENTAR ARCHIVOS CSS
Write-Host "`n📁 Documentando archivos CSS..." -ForegroundColor Cyan

$cssFiles = Get-ChildItem -Path "src" -Recurse -Filter "*.css" -ErrorAction SilentlyContinue

foreach ($cssFile in $cssFiles) {
    $componentName = $cssFile.BaseName
    $totalFiles++
    if (Add-CSSHeader -FilePath $cssFile.FullName -ComponentName $componentName) {
        $documentedFiles++
    }
}

# RESUMEN
Write-Host "`n=========================================" -ForegroundColor Cyan
Write-Host " RESUMEN DE DOCUMENTACIÓN" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Total de archivos procesados: $totalFiles" -ForegroundColor White
Write-Host " Archivos documentados: $documentedFiles" -ForegroundColor Green
Write-Host " Ya documentados: $($totalFiles - $documentedFiles)" -ForegroundColor Yellow
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ Proceso completado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "SIGUIENTE PASO:" -ForegroundColor Yellow
Write-Host "1. Abre GitHub Desktop" -ForegroundColor White
Write-Host "2. Verás todos los archivos modificados" -ForegroundColor White
Write-Host "3. Haz commit con el mensaje: 'Documentación completa del frontend por Dennis Ccapatinta'" -ForegroundColor White
Write-Host "4. Haz Push a tu rama 'dennis-ccapatinta'" -ForegroundColor White
Write-Host ""
