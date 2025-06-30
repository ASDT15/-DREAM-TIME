# Set the path to your JDK folder (update if needed)
$JdkPath = "C:\Java\jdk-11"

# Set JAVA_HOME environment variable (machine-level)
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", $JdkPath, [System.EnvironmentVariableTarget]::Machine)

# Get current PATH environment variable (machine-level)
$envPath = [System.Environment]::GetEnvironmentVariable("Path", [System.EnvironmentVariableTarget]::Machine)

$javaBinPath = "$JdkPath\bin"

# Check if JAVA bin path is already in PATH, if not, add it
if ($envPath -notlike "*$javaBinPath*") {
    $newPath = "$envPath;$javaBinPath"
    [System.Environment]::SetEnvironmentVariable("Path", $newPath, [System.EnvironmentVariableTarget]::Machine)
    Write-Host "`n✔ JAVA bin path added to PATH."
} else {
    Write-Host "`nℹ JAVA bin path already exists in PATH."
}

# Wait a bit then show Java version to confirm
Write-Host "`nChecking Java version..."
Start-Sleep -Seconds 2
cmd /c "java -version"
