build: 
	webpack

package: build
	jq '(.version="${version}")' manifest.json > ./publish/manifest.json
	cp -f -a ./{public,popup.html,background.js,styles.css} ./publish
	cp -r ./icons ./publish
	zip -r publish.zip ./publish
