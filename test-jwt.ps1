# JWT Testing Commands for PowerShell
# Make sure your backend is running on http://localhost:3000

# 1. Test Login (Generate JWT Token)
Write-Host "=== Testing Login (JWT Generation) ===" -ForegroundColor Green
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/login" -Method POST -Body (@{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json) -ContentType "application/json"

Write-Host "Login Response:" -ForegroundColor Yellow
$loginResponse | ConvertTo-Json -Depth 3

# Extract the token
$token = $loginResponse.token
Write-Host "JWT Token: $token" -ForegroundColor Cyan

# 2. Test Protected Route with Valid Token
Write-Host "`n=== Testing Protected Route with Valid Token ===" -ForegroundColor Green
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $protectedResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/profile" -Method GET -Headers $headers
    Write-Host "Protected Route Response:" -ForegroundColor Yellow
    $protectedResponse | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Test Protected Route with Invalid Token
Write-Host "`n=== Testing Protected Route with Invalid Token ===" -ForegroundColor Green
try {
    $invalidHeaders = @{
        "Authorization" = "Bearer invalid.token.here"
    }
    $invalidResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/profile" -Method GET -Headers $invalidHeaders
} catch {
    Write-Host "Expected Error (Invalid Token): $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Test Protected Route without Token
Write-Host "`n=== Testing Protected Route without Token ===" -ForegroundColor Green
try {
    $noTokenResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/profile" -Method GET
} catch {
    Write-Host "Expected Error (No Token): $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== JWT Testing Complete! ===" -ForegroundColor Green