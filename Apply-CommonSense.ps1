# CommonSense visual rebrand. Run from the root of your EXISTING FinanceHub repository.
# Changes only frontend branding files; never edits .env, database, migrations, or storage keys.
$ErrorActionPreference = 'Stop'
$root = (Get-Location).Path
$layout = Join-Path $root 'src\app\layout.tsx'
$page = Join-Path $root 'src\app\page.tsx'
$css = Join-Path $root 'src\app\globals.css'
$settings = Join-Path $root 'src\components\appearance-settings.tsx'
$household = Join-Path $root 'src\app\household\page.tsx'
foreach ($file in @($layout, $page, $css)) {
  if (-not (Test-Path -LiteralPath $file)) { throw "Missing expected file: $file. Run from FinanceHub project root." }
}
$enc = New-Object System.Text.UTF8Encoding($false)
$backup = Join-Path (Split-Path $root -Parent) ('commonsense-backup-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
New-Item -ItemType Directory -Force -Path $backup | Out-Null
$paths = @($layout, $page, $css, $settings, $household) | Where-Object { Test-Path -LiteralPath $_ }
foreach ($file in $paths) {
  $rel = [System.IO.Path]::GetRelativePath($root, $file)
  $target = Join-Path $backup $rel
  New-Item -ItemType Directory -Force -Path (Split-Path $target -Parent) | Out-Null
  Copy-Item -LiteralPath $file -Destination $target
}
function Edit-File([string]$path, [scriptblock]$transform) {
  if (-not (Test-Path -LiteralPath $path)) { return }
  $before = [System.IO.File]::ReadAllText($path)
  $after = & $transform $before
  if ($after -cne $before) {
    [System.IO.File]::WriteAllText($path, $after, $enc)
    Write-Host ('Updated ' + [System.IO.Path]::GetRelativePath($root,$path))
  } else { Write-Host ('No branding text to change in ' + [System.IO.Path]::GetRelativePath($root,$path)) }
}
Edit-File $layout {
  param($s)
  $s = $s.Replace('FinanceHub', 'CommonSense')
  $s = $s.Replace('Open-source self-hosted financial dashboard', 'Make cents of your money. A thoughtful, self-hosted home for personal and shared finances.')
  if ($s -notmatch 'icons\s*:') {
    # Metadata icon is app-owned and does not affect auth/session handling.
    $s = $s -replace '(description:\s*"[^"]*")', '$1, icons: { icon: "/commonsense-mark.svg" }'
  }
  return $s
}
Edit-File $page {
  param($s)
  $s = $s.Replace('FinanceHub home', 'CommonSense home')
  $s = $s.Replace('<strong>FinanceHub</strong><small>PERSONAL FINANCE</small>', '<strong>Common<span className="brand-accent">Sense</span></strong><small>MAKE CENTS OF YOUR MONEY</small>')
  $s = $s.Replace('<ChartNoAxesCombined size={22}/></div><div><strong>Common', '<span className="commonsense-monogram" aria-hidden="true">c.</span></div><div><strong>Common')
  $s = $s.Replace('<div className="workspace-avatar">FH</div>', '<div className="workspace-avatar">CS</div>')
  $s = $s.Replace('>FINANCEHUB</span>', '>COMMONSENSE</span>')
  return $s
}
Edit-File $settings {
  param($s)
  $s = $s.Replace('FinanceHub', 'CommonSense')
  return $s
}
Edit-File $household {
  param($s)
  $s = $s.Replace('← Demo dashboard', '← CommonSense dashboard')
  return $s
}
$branding = @'

/* CommonSense branding — isolated visual changes; respects the selected theme/palette. */
.brand .brand-icon{width:42px;height:42px;border-radius:13px;background:var(--calm-dark,#25473d);color:#e4f3e8;box-shadow:0 5px 15px rgba(24,55,42,.13)}
.brand .commonsense-monogram{font-size:28px;line-height:1;font-weight:850;letter-spacing:-3px;font-family:Georgia,serif;transform:translate(-1px,-2px)}
.brand .brand-accent{color:var(--calm-accent,#638875)}
.brand strong{font-size:19px;letter-spacing:-.65px}
.brand small{font-size:8px;letter-spacing:1.05px;font-weight:750;white-space:nowrap}
.brand-link:hover .brand-accent{opacity:.8}
html[data-theme="dark"] .brand .brand-icon{background:#315a48;color:#e6f5ec}
html[data-theme="dark"] .brand .brand-accent{color:#a2d2b6}
@media(max-width:760px){.brand .brand-icon{width:40px;height:40px}.brand strong{font-size:18px}}
'@
Edit-File $css {
  param($s)
  if ($s.Contains('/* CommonSense branding — isolated visual changes')) { return $s }
  return $s + $branding
}
$public = Join-Path $root 'public'
New-Item -ItemType Directory -Force -Path $public | Out-Null
$iconFile = Join-Path $public 'commonsense-mark.svg'
if (-not (Test-Path $iconFile)) {
  $icon = @'
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="16" fill="#203f34"/>
  <path d="M43 21a19 19 0 1 0 0 22" fill="none" stroke="#BCE4CF" stroke-width="7" stroke-linecap="round"/>
  <circle cx="44" cy="43" r="4" fill="#BCE4CF"/>
</svg>
'@
  [System.IO.File]::WriteAllText($iconFile, $icon, $enc)
  Write-Host 'Created public/commonsense-mark.svg'
}
Write-Host ''
Write-Host "CommonSense visual rebrand applied. Backups: $backup" -ForegroundColor Green
Write-Host 'Next: npm run build (and inspect git diff before committing).'
