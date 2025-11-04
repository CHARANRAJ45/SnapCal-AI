<#
Push the current project to GitHub.

Usage (PowerShell):
  cd <project-root>
  .\scripts\push-to-github.ps1

The script will:
 - Check that git is installed
 - Initialize a git repo if none exists
 - Create a commit with all changes (asks for commit message)
 - Ask for a remote GitHub repository URL and add it
 - Push to the `main` branch

Notes:
 - The script does not accept or store credentials. If you use HTTPS, provide a Personal Access Token (PAT) when prompted by git, or configure the Windows Git Credential Manager.
 - It will not push large files or secrets by default; ensure `.gitignore` is correct before running.
#>

param(
    [string]$RemoteUrl = $(Read-Host "Enter GitHub remote URL (e.g. https://github.com/you/repo.git)")
)

function Fail($msg){ Write-Host "ERROR: $msg" -ForegroundColor Red; exit 1 }

# Ensure running from script directory parent
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Push-Location $ScriptDir\.. | Out-Null

# Check git
try {
    git --version 2>$null | Out-Null
} catch {
    Fail "git is not installed or not in PATH. Install Git and run this script again."
}

# Ensure .gitignore exists
if (-not (Test-Path .gitignore)) {
    Write-Host "No .gitignore found. Creating a sensible default..."
    @"
node_modules/
dist/
build/
.vscode/
.DS_Store
.env
.env.*
server/database.sqlite
server/*.db
server/node_modules/
*.log
coverage/
