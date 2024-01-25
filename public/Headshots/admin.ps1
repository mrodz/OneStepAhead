# Quick script to sync the `/compressed` folder if more photos are added.
param (
	[parameter(Mandatory=$true,
    ParameterSetName="WithA")]
	[switch]
	$Update,
	[parameter(Mandatory=$true,
    ParameterSetName="WithB")]
	[string]
	$NameExists
)

class User {
	[string]$Role
	[string]$Leadership
}

function UpdateCommand {
	[Collections.Generic.Dictionary[string, User]] $users = @{}

	Get-ChildItem -Path "." | ForEach-Object {
		$name = $_.Name.Replace(" ", "")
	
		if (!$name.EndsWith("ps1")) {
			if ($_.DirectoryName.Length -eq 0) {
				Write-Host "Skipping directory `"$name`""
			} elseif (!@(Test-Path $name)) {
				$u = [User]::new()

				$u.Role = "Mentor"
				$u.Leadership = $null
				$users[$_.Basename] = $u

				Rename-Item -Path $_.FullName -NewName $name
				ffmpeg.exe -i $name -vf scale=320:-1 -y $name
				ffmpeg.exe -i $name -vf scale=20:-1 -y "./compressed/$($name)" 
			} else {
				Write-Host "`"$name`" already exists, skipping..."
			}
		} else {
			Write-Host "Skipping powershell file"
		}
	}

	return $users;
}

function SearchCommand {
	param (
		[string]
		$testName
	)

	$testName = $testName.Replace(" ", "")

	if (!$testName.EndsWith(".jpg")) {
		$testName += ".jpg"
	}

	foreach ($file in @(Get-ChildItem -Path ".")) {
		$name = $file.Name.Replace(" ", "")
	
		if ($testName.Equals($name)) {
			
			Write-Host "Okay! Found: ``$($file.FullName)``"
			return
		}
	}

	Write-Host "`"$testName`" Not Found"
}

$JSON_OUT = "../members.json"

function GenerateJSON {
	param (
		[Collections.Generic.Dictionary[string, User]]
		$users
	)

	foreach ($user in $users) {
		Write-Host $user.Role
	}
}

if ($Update.IsPresent) {
	GenerateJSON(UpdateCommand)
} else {
	SearchCommand($NameExists)
}

