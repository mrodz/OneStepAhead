# Quick script to sync the `/compressed` folder if more photos are added.

Get-ChildItem -Path "." | ForEach-Object {
	ffmpeg -i $_.FullName -vf scale=20:-1 "./compressed/$($_.Name)"
}