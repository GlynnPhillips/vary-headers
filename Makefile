build: 
	webpack

package: build
	jq '(.version="${version}")' manifest.json > ./publish/manifest.json
	cp -f -a ./{public,popup.html,background.js,reset.css,styles.css} ./publish
	zip -r publish.zip ./publish
