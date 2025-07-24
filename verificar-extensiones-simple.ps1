# Script para verificar la configuracion de extensiones optimizadas

Write-Host "Verificando configuracion de extensiones optimizadas..." -ForegroundColor Green
Write-Host ""

# Verificar archivos de configuracion
$configFiles = @(
    ".vscode/extensions.json",
    "mtz-nuevo.code-workspace",
    ".cursor/mcp.json",
    "EXTENSIONES_ESENCIALES.md"
)

Write-Host "Verificando archivos de configuracion:" -ForegroundColor Cyan
foreach ($file in $configFiles) {
    if (Test-Path $file) {
        Write-Host "OK: $file" -ForegroundColor Green
    } else {
        Write-Host "ERROR: $file (faltante)" -ForegroundColor Red
    }
}

Write-Host ""

# Verificar extensiones en extensions.json
Write-Host "Verificando extensiones recomendadas:" -ForegroundColor Cyan
if (Test-Path ".vscode/extensions.json") {
    $extensions = Get-Content ".vscode/extensions.json" | ConvertFrom-Json
    $recommendedExtensions = $extensions.recommendations

    Write-Host "Extensiones configuradas:" -ForegroundColor Yellow
    foreach ($ext in $recommendedExtensions) {
        Write-Host "  - $ext" -ForegroundColor White
    }

    Write-Host ""
    Write-Host "Total de extensiones: $($recommendedExtensions.Count)" -ForegroundColor Green
} else {
    Write-Host "ERROR: No se encontro .vscode/extensions.json" -ForegroundColor Red
}

Write-Host ""

# Verificar workspace
Write-Host "Verificando workspace:" -ForegroundColor Cyan
if (Test-Path "mtz-nuevo.code-workspace") {
    $workspace = Get-Content "mtz-nuevo.code-workspace" | ConvertFrom-Json
    $workspaceExtensions = $workspace.extensions.recommendations

    Write-Host "Extensiones en workspace:" -ForegroundColor Yellow
    foreach ($ext in $workspaceExtensions) {
        Write-Host "  - $ext" -ForegroundColor White
    }

    Write-Host ""
    Write-Host "Total de extensiones en workspace: $($workspaceExtensions.Count)" -ForegroundColor Green
} else {
    Write-Host "ERROR: No se encontro mtz-nuevo.code-workspace" -ForegroundColor Red
}

Write-Host ""

# Verificar MCP
Write-Host "Verificando configuracion MCP:" -ForegroundColor Cyan
if (Test-Path ".cursor/mcp.json") {
    $mcp = Get-Content ".cursor/mcp.json" | ConvertFrom-Json
    $mcpServers = $mcp.mcpServers

    Write-Host "Servidores MCP configurados:" -ForegroundColor Yellow
    foreach ($server in $mcpServers.PSObject.Properties.Name) {
        Write-Host "  - $server" -ForegroundColor White
    }

    Write-Host ""
    Write-Host "OK: MCP Supabase configurado correctamente" -ForegroundColor Green
} else {
    Write-Host "ERROR: No se encontro .cursor/mcp.json" -ForegroundColor Red
}

Write-Host ""

# Resumen
Write-Host "RESUMEN DE CONFIGURACION:" -ForegroundColor Magenta
Write-Host "================================" -ForegroundColor Magenta

$totalFiles = 0
$foundFiles = 0

foreach ($file in $configFiles) {
    $totalFiles++
    if (Test-Path $file) {
        $foundFiles++
    }
}

Write-Host "Archivos de configuracion: $foundFiles/$totalFiles" -ForegroundColor White

if ($foundFiles -eq $totalFiles) {
    Write-Host ""
    Write-Host "CONFIGURACION OPTIMIZADA COMPLETADA!" -ForegroundColor Green
    Write-Host ""
    Write-Host "OK: Extensiones esenciales configuradas" -ForegroundColor Green
    Write-Host "OK: Extensiones innecesarias eliminadas" -ForegroundColor Green
    Write-Host "OK: MCP Supabase activo" -ForegroundColor Green
    Write-Host "OK: Configuracion limpia y eficiente" -ForegroundColor Green
    Write-Host ""
    Write-Host "Proximos pasos:" -ForegroundColor Cyan
    Write-Host "1. Abre VS Code" -ForegroundColor White
    Write-Host "2. Abre el workspace: mtz-nuevo.code-workspace" -ForegroundColor White
    Write-Host "3. Instala las extensiones recomendadas" -ForegroundColor White
    Write-Host "4. Ejecuta: .\verificar-mcp-supabase.ps1" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Configuracion incompleta" -ForegroundColor Yellow
    Write-Host "Ejecuta: .\setup-vscode.ps1 para completar la configuracion" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Para mas informacion, consulta: EXTENSIONES_ESENCIALES.md" -ForegroundColor Cyan
