import awsSigner from './lib/aws-signer';

chrome.webRequest.onBeforeRequest.addListener(function(details) {
	if (isUrlValid(details.url)) {
		const profile = getActiveProfile();
		if (profile.aws) {
			awsSigner.beforeRequest(details, profile.aws);
		}
	}
},
{urls: ["<all_urls>"]},
["blocking", "requestBody"]);

chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
	if (isUrlValid(details.url)) {
		const profile = getActiveProfile();

		let headers = profile.headers;
		
		headers = headers.filter(header => {
			return header.enabled;
		});

		headers.forEach(header => {
			const name = header.name;
	    	const value = header.value;
			
			details.requestHeaders.push({name: name, value: value});
		});	

		if (profile.aws) {
			const awsHeaders = awsSigner.beforeSendHeaders(details, profile.aws);
			if (awsHeaders) {
				awsHeaders.forEach(header => details.requestHeaders.push(header));
			}
		}

		return {requestHeaders: details.requestHeaders};
	}
},
{urls: ["<all_urls>"]},
["blocking", "requestHeaders"]);

const isUrlValid = (url) => {
	const host = new URL(url).host;	
	return host.match(/ft\.com(:[0-9]{4})?$/) ||
		host.match(/ft\-next\-(.*)\.herokuapp\.com$/) ||
		host.match(/^next-elastic.ft.com$/) ||
		host.match(/^search-next-elasticsearch-[^-*].(eu-west-1|us-east-1).es.amazonaws.com$/);
};

const getActiveProfile = () => {
	const profiles = JSON.parse(localStorage.getItem('profiles'));
	const activeProfile = parseInt(localStorage.getItem('activeProfile'));
	
	const profile = profiles.find(profile => {
		return profile.id === activeProfile;
	});

	return profile;
};
