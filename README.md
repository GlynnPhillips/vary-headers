# Vary Headers


## Running locally

`make build` will build the latest version of the client side Javascript and then most of the time you will be able to just view `popup.html` in a browser unless you actually need to check that headers are being set.

## Deploying

`make package version=${version number}` this command will produce a `publish.zip` file that can then be added to the Chrome web store
