# Script para configurar VS Code para el proyecto MTZ-NUEVO

Write-Host "Configurando VS Code para MTZ-NUEVO..." -ForegroundColor Green

# Verificar que estamos en el directorio correcto
if (!(Test-Path "package.json")) {
    Write-Host "Error: No se encontro package.json. Ejecuta este script desde la raiz del proyecto." -ForegroundColor Red
    exit 1
}

# Verificar archivos de configuracion
$requiredFiles = @(
    ".vscode/settings.json",
    ".vscode/extensions.json"
)

Write-Host "Verificando archivos de configuracion..." -ForegroundColor Cyan
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "OK: $file" -ForegroundColor Green
    } else {
        Write-Host "ERROR: $file (faltante)" -ForegroundColor Red
    }
}

Write-Host ""

# Crear archivo de workspace si no existe
if (!(Test-Path "mtz-nuevo.code-workspace")) {
    Write-Host "Creando archivo de workspace..." -ForegroundColor Yellow

    $workspace = @{
        folders = @(
            @{
                path = "."
                name = "MTZ-NUEVO"
            }
        )
        settings = @{
            "files.associations" = @{
                "*.sql" = "sql"
            }
            "sql.format.enable" = $true
            "sql.format.uppercase" = $true
            "sql.format.keywordCase" = "upper"
        }
        extensions = @{
            recommendations = @(
                "bradlc.vscode-tailwindcss",
                "esbenp.prettier-vscode",
                "ms-vscode.vscode-json",
                "ms-vscode.vscode-eslint",
                "ms-vscode.vscode-typescript-next"
            )
        }
    }

    $workspace | ConvertTo-Json -Depth 10 | Set-Content "mtz-nuevo.code-workspace"
    Write-Host "Archivo de workspace creado: mtz-nuevo.code-workspace" -ForegroundColor Green
}

Write-Host ""

# Crear archivo de tareas para VS Code
if (!(Test-Path ".vscode/tasks.json")) {
    Write-Host "Creando archivo de tareas..." -ForegroundColor Yellow

    $tasks = @{
        version = "2.0.0"
        tasks = @(
            @{
                label = "Verificar Supabase"
                type = "shell"
                command = "powershell"
                args = @("-ExecutionPolicy", "Bypass", "-File", "verificar-mcp-supabase.ps1")
                group = "build"
                presentation = @{
                    echo = $true
                    reveal = "always"
                    focus = $false
                    panel = "shared"
                    showReuseMessage = $true
                    clear = $false
                }
            }
        )
    }

    $tasks | ConvertTo-Json -Depth 10 | Set-Content ".vscode/tasks.json"
    Write-Host "Archivo de tareas creado: .vscode/tasks.json" -ForegroundColor Green
}

Write-Host ""

# Crear archivo de snippets para SQL
if (!(Test-Path ".vscode/sql.code-snippets")) {
    Write-Host "Creando snippets para SQL..." -ForegroundColor Yellow

    $snippets = @{
        "SELECT Query" = @{
            prefix = "select"
            body = @(
                "SELECT ",
                "    $1",
                "FROM $2",
                "WHERE $3;"
            )
            description = "Basic SELECT query"
        }
        "INSERT Query" = @{
            prefix = "insert"
            body = @(
                "INSERT INTO $1 (",
                "    $2",
                ") VALUES (",
                "    $3",
                ");"
            )
            description = "Basic INSERT query"
        }
        "UPDATE Query" = @{
            prefix = "update"
            body = @(
                "UPDATE $1",
                "SET $2",
                "WHERE $3;"
            )
            description = "Basic UPDATE query"
        }
        "CREATE TABLE" = @{
            prefix = "table"
            body = @(
                "CREATE TABLE $1 (",
                "    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),",
                "    created_at TIMESTAMPTZ DEFAULT NOW(),",
                "    updated_at TIMESTAMPTZ DEFAULT NOW()",
                ");"
            )
            description = "Create table with common fields"
        }
    }

    $snippets | ConvertTo-Json -Depth 10 | Set-Content ".vscode/sql.code-snippets"
    Write-Host "Snippets creados: .vscode/sql.code-snippets" -ForegroundColor Green
}

Write-Host ""

Write-Host "Configuracion de VS Code completada!" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos pasos:" -ForegroundColor Cyan
Write-Host "1. Abre VS Code" -ForegroundColor White
Write-Host "2. Abre el archivo: mtz-nuevo.code-workspace" -ForegroundColor White
Write-Host "3. Instala las extensiones recomendadas" -ForegroundColor White
Write-Host "4. Ejecuta: .\verificar-mcp-supabase.ps1 para verificar Supabase" -ForegroundColor White
Write-Host ""
Write-Host "Para verificar la configuracion, ejecuta: .\verificar-mcp-supabase.ps1" -ForegroundColor Yellow
