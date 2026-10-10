# CommonSense UI refresh for existing FinanceHub/CommonCents projects.
# Frontend-only. Preserves auth, Prisma, Docker, env and localStorage keys.
$ErrorActionPreference = 'Stop'
$root = (Get-Location).Path
$paths = @('src\app\page.tsx','src\app\household\page.tsx','src\app\layout.tsx','src\app\globals.css')
foreach ($rel in $paths) { if (-not (Test-Path (Join-Path $root $rel))) { throw "Missing $rel; run from project root." } }
$enc = New-Object System.Text.UTF8Encoding($false)
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backup = Join-Path $root ('.commonsense-backup-' + $stamp)
foreach ($rel in $paths) {
  $from = Join-Path $root $rel
  $dest = Join-Path $backup $rel
  New-Item -ItemType Directory -Force -Path (Split-Path $dest -Parent) | Out-Null
  Copy-Item -LiteralPath $from -Destination $dest
}
function Update-Text([string]$rel, [scriptblock]$change) {
  $path = Join-Path $root $rel
  $before = [IO.File]::ReadAllText($path)
  $after = & $change $before
  if ($after -cne $before) { [IO.File]::WriteAllText($path, $after, $enc); Write-Host "Updated $rel" -ForegroundColor Green }
  else { Write-Host "No change needed: $rel" }
}
Update-Text 'src\app\page.tsx' {
  param($s)
  # Replace repeated JSX paragraph wrappers introduced by the prior build-fix patch.
  $s = [regex]::Replace($s, '<p(\s[^>]*)?>\s*<p(\s[^>]*)?>(Here(?:&apos;|\x27)s a snapshot)', '<p$1>$3')
  $s = [regex]::Replace($s, '(Transaction cards and charts update from your entries\.</p>)\s*</p>', '$1')
  $s = $s.Replace("Here's a snapshot", 'Here&apos;s a snapshot').Replace("we'll connect this feature", 'we&apos;ll connect this feature')
  $s = $s.Replace('ArrowDownRight, ArrowUpRight, Bell', 'ArrowDownRight, Bell').Replace('PiggyBank, Plus, ReceiptText', 'PiggyBank, ReceiptText')
  $s = $s.Replace('aria-label="FinanceHub home"', 'aria-label="CommonSense home"')
  $s = $s.Replace('<strong>FinanceHub</strong><small>PERSONAL FINANCE</small>', '<strong>Common<span className="brand-accent">Sense</span></strong><small>MAKE CENTS OF YOUR MONEY</small>')
  $s = $s.Replace('<strong>FinanceHub</strong>', '<strong>Common<span className="brand-accent">Sense</span></strong>')
  $s = $s.Replace('<ChartNoAxesCombined size={22}/></div><div><strong>Common', '<span className="commonsense-mark" aria-hidden="true">c.</span></div><div><strong>Common')
  $s = $s.Replace('<div className="workspace-avatar">FH</div>', '<div className="workspace-avatar">CS</div>')
  $s = $s.Replace('>FINANCEHUB</span>', '>COMMONSENSE</span>')
  $s = $s.Replace('>Demo Workspace</strong>', '>Your workspace</strong>')
  $s = $s.Replace('>Demo dashboard</', '>CommonSense dashboard</')
  $s = $s.Replace('>Demo profile</', '>Demo profile</')
  # Do not modify financehub localStorage keys; these protect existing browser data.
  return $s
}
Update-Text 'src\app\household\page.tsx' {
  param($s)
  $s = [regex]::Replace($s, '<a\s+href="/"([^>]*)>(.*?)</a>', '<Link href="/"$1>$2</Link>', [Text.RegularExpressions.RegexOptions]::Singleline)
  if ($s.Contains('<Link href="/"') -and $s -notmatch 'import\s+Link\s+from\s+["\x27]next/link') {
    if ($s -match '^\s*["\x27]use client["\x27]\s*;') { $s = [regex]::Replace($s, '^(\s*["\x27]use client["\x27]\s*;)', '$1' + "`r`n" + 'import Link from "next/link";', 1) }
    else { $s = 'import Link from "next/link";' + "`r`n" + $s }
  }
  $s = $s.Replace('← Demo dashboard', '← CommonSense dashboard')
  return $s
}
Update-Text 'src\app\layout.tsx' {
  param($s)
  $s = $s.Replace('FinanceHub | Dashboard', 'CommonSense | Your financial home').Replace('Open-source self-hosted financial dashboard', 'Make cents of your money. A calmer home for personal and household finances.')
  if ($s -notmatch 'icons\s*:') { $s = [regex]::Replace($s, '(description:\s*"[^"]*")', '$1, icons: { icon: "/commonsense-mark.svg" }', 1) }
  return $s
}
$cssFile = Join-Path $PSScriptRoot 'commonsense-refresh.css'
$css = [IO.File]::ReadAllText($cssFile)
Update-Text 'src\app\globals.css' {
  param($s)
  $start = '/* CommonSense UI Refresh BEGIN */'
  $end = '/* CommonSense UI Refresh END */'
  $pattern = '(?s)/\* CommonSense UI Refresh BEGIN \*/.*?/\* CommonSense UI Refresh END \*/'
  if ($s.Contains($start)) { return [regex]::Replace($s, $pattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($m) $css }) }
  return $s + "`r`n" + $css
}
$icon = Join-Path $root 'public\commonsense-mark.svg'
if (-not (Test-Path $icon)) { New-Item -ItemType Directory -Force -Path (Split-Path $icon -Parent) | Out-Null }
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'commonsense-mark.svg') -Destination $icon -Force
Write-Host "Backups saved to: $backup" -ForegroundColor Cyan
Write-Host 'Completed frontend refresh. Run: npm run build' -ForegroundColor Cyan
