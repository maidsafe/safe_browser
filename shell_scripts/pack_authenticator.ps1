$DEST_FOLD = "../app/node_modules/beaker-plugin-safe-authenticator-1"

cd safe_authenticator

git submodule update --init --recursive

npm i && npm run build-native && npm run build 

$FILES_ARR = @("./dist", "./index.js", "./package.json")

if( -Not (Test-Path -Path $DEST_FOLD ) )
{
    New-Item -ItemType directory -Path $DEST_FOLD
}

for ($i=0; $i -lt $FILES_ARR.length; $i++) {
	Copy-Item $FILES_ARR[$i] $DEST_FOLD -Recurse -Force
}

"Packed Authenticator!"
