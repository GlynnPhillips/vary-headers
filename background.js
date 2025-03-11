const allResourceTypes = Object.values(chrome.declarativeNetRequest.ResourceType);

chrome.runtime.onMessage.addListener(
	function(request) {
		if (request.action === "profileUpdate") {
			chrome.storage.sync.get('profiles', function(cache) {
				const { profiles } = cache;

				const headers = profiles[0].headers.map(headerObject => {

					try {
						/**
						 * Check if header name and values are valid
						 */

						new Headers([
							[headerObject.header, headerObject.value]
						]);
					} catch (error) {
						/**
						 * Remove headers that are invalid
						 */
						console.log(`The "${headerObject.header}" header has been filtered from the request because it is invalid: ${error}`);
						return null;
					}

					return {
						header: !headerObject.disabled ? headerObject.header : '',
						value: !headerObject.disabled ? headerObject.value : '',
						operation: chrome.declarativeNetRequest.HeaderOperation.SET
					}

				}).filter(headerObject => {
					return headerObject && headerObject.header !== "" && headerObject.value !== ""
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