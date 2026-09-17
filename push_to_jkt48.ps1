param (
    [string]$token = $env:GITHUB_TOKEN
)

if (-not $token) {
    $token = Read-Host "Enter your GitHub Personal Access Token (PAT)"
}

if (-not $token) {
    Write-Error "GitHub Token is required to push to skyy134243/JKT48"
    exit 1
}

$repoOwner = "skyy134243"
$repoName = "JKT48"
$branch = "main"
$rootDir = $PSScriptRoot

$headers = @{
    "Authorization" = "token $token"
    "User-Agent"    = "PowerShell-Deployment"
    "Content-Type"  = "application/json"
}

Write-Host "Verifying GitHub repository https://github.com/$repoOwner/$repoName..." -ForegroundColor Cyan
try {
    $repo = Invoke-RestMethod -Uri "https://api.github.com/repos/$repoOwner/$repoName" -Headers $headers
    Write-Host "Connected to $($repo.full_name) (Default branch: $($repo.default_branch))" -ForegroundColor Green
} catch {
    Write-Error "Failed to connect to GitHub repo. Check your token and permissions: $_"
    exit 1
}

# Collect all files to deploy
$files = Get-ChildItem -Path $rootDir -Recurse -File | Where-Object {
    $_.FullName -notmatch "node_modules|\.git|push_to_jkt48\.ps1"
}

Write-Host "Found $($files.Count) files to push..." -ForegroundColor Cyan

foreach ($file in $files) {
    $relative = $file.FullName.Substring($rootDir.Length).TrimStart("\", "/").Replace("\", "/")
    Write-Host "Deploying $relative..." -NoNewline

    $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
    $base64 = [System.Convert]::ToBase64String($bytes)

    # Check if file exists on GitHub to obtain sha
    $sha = $null
    try {
        $existing = Invoke-RestMethod -Uri "https://api.github.com/repos/$repoOwner/$repoName/contents/$relative?ref=$branch" -Headers $headers -ErrorAction Stop
        $sha = $existing.sha
    } catch {
        # File doesn't exist yet on remote
    }

    $payload = @{
        message = "feat: add $relative for JKT48 Live Radar"
        content = $base64
        branch  = $branch
    }

    if ($sha) {
        $payload["sha"] = $sha
    }

    $jsonBody = $payload | ConvertTo-Json -Compress

    try {
        $putResult = Invoke-RestMethod -Uri "https://api.github.com/repos/$repoOwner/$repoName/contents/$relative" -Method Put -Headers $headers -Body $jsonBody
        Write-Host " [OK]" -ForegroundColor Green
    } catch {
        Write-Host " [FAILED: $($_.Exception.Message)]" -ForegroundColor Red
    }
}

Write-Host "`nAll files deployed to https://github.com/$repoOwner/$repoName successfully!" -ForegroundColor Green
