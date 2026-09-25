# Asentramerian JKT48 Live Radar Watcher (PowerShell Edition)
# Runs natively on Windows without requiring Node.js!
# Scans SHOWROOM & IDN Live and keeps live_data.json up to date.

param (
    [int]$IntervalSeconds = 15,
    [switch]$Loop,
    [string]$GitHubToken = $env:GITHUB_TOKEN
)

$baseDir = "C:\Users\LAB 1 SAKA\.gemini\antigravity\scratch\jkt48-live-radar"

Write-Host "==========================================================" -ForegroundColor Red
Write-Host "  ASENTRAMERIAN JKT48 LIVE RADAR WATCHER (POWERSHELL)     " -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Red
Write-Host "Base Directory: $baseDir"

function Get-LiveStreams() {
    $lives = @()

    # 1. Check Community Open Live API (crstlnz)
    try {
        $crstlnz = Invoke-RestMethod -Uri "https://api.crstlnz.my.id/api/now_live" -TimeoutSec 4 -Headers @{ "User-Agent" = "Asentramerian-Watcher/2.0" } -ErrorAction Stop
        if ($crstlnz -and $crstlnz.Count -gt 0) {
            Write-Host "  [API] Detected $($crstlnz.Count) active stream(s) via Live Gateway!" -ForegroundColor Green
            foreach ($s in $crstlnz) {
                $platform = if ($s.type -match "idn") { "IDN Live" } else { "SHOWROOM" }
                $lives += [PSCustomObject]@{
                    memberId = $s.url_key
                    name = $s.name
                    nickname = $s.name
                    platform = $platform
                    platformKey = if ($platform -eq "IDN Live") { "idn" } else { "showroom" }
                    title = if ($s.title) { $s.title } else { "$platform - $($s.name)" }
                    liveUrl = $s.url
                    startedAt = if ($s.started_at) { $s.started_at } else { (Get-Date).ToString("o") }
                    photoUrl = $s.img
                }
            }
        }
    } catch {
        # ignore or continue
    }

    # 2. Check SHOWROOM Official Directory
    try {
        $sr = Invoke-RestMethod -Uri "https://www.showroom-live.com/api/live/onlives" -TimeoutSec 5 -Headers @{ "User-Agent" = "Mozilla/5.0" } -ErrorAction Stop
        if ($sr -and $sr.onlives) {
            foreach ($genre in $sr.onlives) {
                if ($genre.lives) {
                    foreach ($room in $genre.lives) {
                        $key = $room.room_url_key
                        if ($key -match "JKT48") {
                            $lives += [PSCustomObject]@{
                                memberId = $key
                                name = $room.main_name
                                nickname = $key
                                platform = "SHOWROOM"
                                platformKey = "showroom"
                                title = $room.main_name
                                liveUrl = "https://www.showroom-live.com/r/$key"
                                startedAt = (Get-Date).ToString("o")
                                photoUrl = $room.image_square
                            }
                        }
                    }
                }
            }
        }
    } catch {
        # ignore or continue
    }

    return $lives
}

function Update-LiveJson() {
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Scanning live streams..." -ForegroundColor Cyan
    $activeLives = Get-LiveStreams

    $payload = [PSCustomObject]@{
        last_updated = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
        total_live = $activeLives.Count
        live_sessions = $activeLives
    }

    $json = $payload | ConvertTo-Json -Depth 5

    $targets = @(
        "$baseDir\live_data.json",
        "$baseDir\dist\live_data.json",
        "$baseDir\data\live_data.json",
        "$baseDir\dist\data\live_data.json"
    )

    foreach ($t in $targets) {
        $dir = Split-Path -Parent $t
        if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
        [System.IO.File]::WriteAllText($t, $json, [System.Text.Encoding]::UTF8)
    }

    Write-Host "  -> Updated live_data.json ($($activeLives.Count) active streams)" -ForegroundColor Green
}

if ($Loop) {
    Write-Host "Watcher running every $IntervalSeconds seconds... (Press Ctrl+C to stop)" -ForegroundColor Yellow
    while ($true) {
        Update-LiveJson
        Start-Sleep -Seconds $IntervalSeconds
    }
} else {
    Update-LiveJson
}
