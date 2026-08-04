# ==========================================================================
# Can 2 Curb — tiny local preview server (Windows, no dependencies)
# --------------------------------------------------------------------------
# Serves the static site with CLEAN URLs (e.g. /how-it-works/ -> that folder's
# index.html) so the site behaves exactly like it will in production.
#
# USAGE:  right-click > "Run with PowerShell", or in a terminal:
#           powershell -ExecutionPolicy Bypass -File serve.ps1
#         then open http://localhost:8000/ in your browser.
#
# Alternatives if you have them installed:
#           python -m http.server 8000
#           npx serve .
# ==========================================================================
param([int]$Port = 8000)

$root = $PSScriptRoot
$mime = @{
  ".html"="text/html; charset=utf-8"; ".css"="text/css; charset=utf-8";
  ".js"="text/javascript; charset=utf-8"; ".svg"="image/svg+xml";
  ".png"="image/png"; ".jpg"="image/jpeg"; ".jpeg"="image/jpeg";
  ".webp"="image/webp"; ".ico"="image/x-icon"; ".xml"="application/xml";
  ".txt"="text/plain; charset=utf-8"; ".json"="application/json"; ".woff2"="font/woff2"
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Can 2 Curb preview running at http://localhost:$Port/  (Ctrl+C to stop)" -ForegroundColor Green

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $path = [System.Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath)
    $rel = $path.TrimStart("/")
    $file = Join-Path $root $rel
    if ($path.EndsWith("/") -or -not [System.IO.Path]::HasExtension($file)) {
      $file = Join-Path (Join-Path $root $rel) "index.html"
    }
    if (Test-Path $file -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($file).ToLower()
      $ct = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { "application/octet-stream" }
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $ctx.Response.ContentType = $ct
      $ctx.Response.ContentLength64 = $bytes.Length
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
      $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
      $ctx.Response.OutputStream.Write($msg, 0, $msg.Length)
    }
    $ctx.Response.OutputStream.Close()
  }
} finally {
  $listener.Stop()
}
