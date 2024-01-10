# Quick script to sync the `/compressed` folder if more photos are added.
param (
	[parameter(Mandatory=$true,
    ParameterSetName="WithA")]
	[switch]
	$Update,
	[parameter(Mandatory=$true,
    ParameterSetName="WithB")]
	[String]
	$NameExists
)

function UpdateCommand {
	Get-ChildItem -Path "." | ForEach-Object {
		$name = $_.Name.Replace(" ", "")
	
		if (!$name.EndsWith("ps1")) {
			Rename-Item -Path $_.FullName -NewName $name
	
			ffmpeg.exe -i $name -vf scale=320:-1 -y $name
			ffmpeg.exe -i $name -vf scale=20:-1 -y "./compressed/$($name)" 
		}
	}
}

function SearchCommand {
	param (
		[String]
		$testName
	)

	$testName = $testName.Replace(" ", "")

	if (!$testName.EndsWith(".jpg")) {
		$testName += ".jpg"
	}

	foreach ($file in @(Get-ChildItem -Path ".")) {
		$name = $file.Name.Replace(" ", "")
	
		if ($testName.Equals($name)) {
			
			Write-Output "Okay! Found: ``$($file.FullName)``"
			return
		}
	}

	Write-Output "`"$testName`" Not Found"
}

if ($Update.IsPresent) {
	UpdateCommand
} else {
	SearchCommand($NameExists)
}

