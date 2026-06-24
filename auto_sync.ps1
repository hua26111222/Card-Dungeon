$projectPath = "C:\Users\wb659999\OneDrive - WBG\Desktop\CD0.1"
Set-Location $projectPath

$status = git status --porcelain
if ($status) {
    git add .
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    git commit -m "Auto sync - $timestamp"
    git push origin main
}
