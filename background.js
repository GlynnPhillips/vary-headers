const allResourceTypes = Object.values(chrome.declarativeNetRequest.ResourceType);

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.action === "profileUpdate") {
			chrome.storage.sync.get('profiles', function(cache) {
				const { profiles } = cache;

				const headers = profiles[0].headerNames.map((name, index) => {
					const headerValue = profiles[0].headerValues[index] || "";

					return {
						header: name,
						value: headerValue,
						operation: chrome.declarativeNetRequest.HeaderOperation.SET
					}
				}).filter(headerObject => {
					return headerObject.header !== '' && headerObject.value !== ''
				});


				chrome.declarativeNetRequest.updateDynamicRules({
					removeRuleIds: [1] // Remove existing rules each time we update the rules
				});

				if (headers.length) {
					chrome.declarativeNetRequest.updateDynamicRules({
						addRules: [
							{
								id: 1,
								priority: 1,
								action: {
									type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
									requestHeaders: headers,
								},
								condition: {
									resourceTypes: allResourceTypes,
								},
							},
						]
					});
				}
			});
		}
	}
);