document.addEventListener('DOMContentLoaded', function() {

	const profileSection = document.querySelector('[data-profile]');

	/**
	 * Load existing headers from storage
	 */
	chrome.storage.sync.get('profiles', function(cache) {
		const { profiles } = cache;

		if (!profiles?.length) {
			return;
		}

		/**
		 * Populate the inputs
		 */

		if (profiles[0]?.headerNames?.length) {
			profiles[0].headerNames.forEach((name, index) => {
				profileSection.querySelectorAll('[data-header-name]')[index].value = name;
			});
		}

		if (profiles[0]?.headerValues?.length) {
			profiles[0].headerValues.forEach((value, index) => {
				profileSection.querySelectorAll('[data-header-value]')[index].value = value;
			});
		}
	});

	/**
	 * Save active profile when changes are made
	 */

	let timeoutId;

	profileSection.onkeyup = function() {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(function() {
			const headerNames = Array.from(profileSection.querySelectorAll('[data-header-name]'))
				.map(nameElement => nameElement.value);
			const headerValues = Array.from(profileSection.querySelectorAll('[data-header-value]'))
				.map(valueElement => valueElement.value);

			const profiles = [
				{
					headerNames,
					headerValues
				}
			];

			chrome.storage.sync.set({ profiles });

			// Notify background service worker
			chrome.runtime.sendMessage({action: "profileUpdate"});
		}, 500);
	};
});
