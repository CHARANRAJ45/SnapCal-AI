Push to GitHub helper

Run the helper PowerShell script `scripts/push-to-github.ps1` from the project root to:
- initialize a git repository (if needed)
- add & commit all changes
- add a remote and push to `main`

Usage:
```powershell
cd 'C:\path\to\snapcal-ai_-nutrition-tracker (3)'
.
\scripts\push-to-github.ps1
```

If Git is not installed, install it first from https://git-scm.com/ or via winget.

Security note: do not paste secrets into the remote URL. Use a GitHub PAT if prompted for credentials over HTTPS, or set up SSH keys and use the SSH remote URL.
