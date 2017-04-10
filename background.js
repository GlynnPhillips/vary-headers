chrome.webRequest.onBeforeSendHeaders.addListener(
function(details) {
  	
	const host = new URL(details.url).host;	
  	if (host.match(/ft\.com$/) || host.match(/ft\-next\-(.*)\.herokuapp\.com$/)) {
	  	const profiles = JSON.parse(localStorage.getItem('profiles'));
	  	const activeProfile = parseInt(localStorage.getItem('activeProfile'));
		
		const profile = profiles.find(profile => {
			return profile.id === activeProfile;
		});
		let headers = profile.headers;
		
		headers = headers.filter(header => {
			return header.enabled;
		});

		headers.forEach(header => {
			const name = header.name;
	    	const value = header.value;
			
			details.requestHeaders.push({name: name, value: value});
		});	

		details.requestHeaders.push({name: 'lalala', value: 'value'});

		return {requestHeaders: details.requestHeaders};
	}
},
{urls: ["<all_urls>"]},
["blocking", "requestHeaders"]);

