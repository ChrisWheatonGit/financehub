CommonSense UI Refresh

1. Extract this ZIP anywhere (for example Downloads\commonsense-ui-refresh).
2. Open a PowerShell terminal in your existing project: C:\Github Projects\CommonCents
3. Run:
   powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$env:USERPROFILE\Downloads\commonsense-ui-refresh\Install-CommonSense.ps1"
   (adjust the extracted path if necessary; inspect the script before running)
4. Run: npm run build
5. Run: npm run dev and hard-refresh the page (Ctrl+Shift+R).

The script changes only src/app/page.tsx, src/app/household/page.tsx,
src/app/layout.tsx, src/app/globals.css and public/commonsense-mark.svg.
It backs up original four files in a dated .commonsense-backup-* directory
inside your project. It preserves PostgreSQL, Prisma, authentication,
Docker configuration and existing financehub localStorage keys.

Note: The working copy on your PC was not available for test-build here.
If a build or hydration error remains, upload the actual current project ZIP
(excluding node_modules, .next, .env and secrets) for an exact audited update.
