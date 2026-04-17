# Auto-commit script for PowerShell
# Usage: ./auto-commit.ps1

# Get list of staged files
$files = git diff --cached --name-only

# Count changes by type
$addedFiles = git diff --cached --name-only --diff-filter=A
$modifiedFiles = git diff --cached --name-only --diff-filter=M
$deletedFiles = git diff --cached --name-only --diff-filter=D

$added = if ($addedFiles) { ($addedFiles | Measure-Object).Count } else { 0 }
$modified = if ($modifiedFiles) { ($modifiedFiles | Measure-Object).Count } else { 0 }
$deleted = if ($deletedFiles) { ($deletedFiles | Measure-Object).Count } else { 0 }

# Get first 3 filenames for the message
$fileList = ($files | Select-Object -First 3) -join ', '
if ($fileList.Length -gt 50) {
    $fileList = $fileList.Substring(0, 50) + '...'
}

# Build commit message
$msg = "update: $modified modified, $added added, $deleted deleted"
if ($fileList) {
    $msg = "$msg [$fileList]"
}

# Show what will be committed
Write-Host "Committing with message: $msg" -ForegroundColor Green
Write-Host ""

# Commit
git commit -m "$msg"
