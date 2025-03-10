const createHeaderUI = ({
	name = '',
	value = ''
} = {}) => {
	return `
		<div data-header-group>
			<label>
				Header name
				<input name="name" autocomplete="off" data-header-name value="${name}"/>
			</label>

			<label>
				Header value
				<input name="value" autocomplete="off" data-header-value value="${value}"/>
			</label>
		</div>
	`;
};

document.addEventListener('DOMContentLoaded', function() {

	const profileSection = document.querySelector('[data-profile]');

	/**
	 * Load existing headers from storage
	 */
	chrome.storage.sync.get('profiles', function(cache) {
		const { profiles } = cache;

		/**
		 * Build header UI
		 */

		if (!profiles || !profiles[0]?.headers?.length) {
			profileSection.insertAdjacentHTML('beforeend', createHeaderUI());
		} else {
			const existingHeaderUI = profiles[0].headers.map(headerObject => {
				return createHeaderUI({
					name: headerObject.header,
					value: headerObject.value
				});
			});

			profileSection.insertAdjacentHTML('beforeend', existingHeaderUI.join(''));
		}
	});

	/**
	 * Save active profile when changes are made
	 */

	let timeoutId;

	profileSection.onkeyup = function() {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(function() {

			const headers = Array.from(profileSection.querySelectorAll('[data-header-group]'))
				.map(groupElement => {
					const nameElement = groupElement.querySelector('[data-header-name]');
					const valueElement = groupElement.querySelector('[data-header-value]');

					return {
						header: nameElement.value,
						value: valueElement.value
					}
				});


			const profiles = [
				{
					headers
				}
			];

			chrome.storage.sync.set({ profiles });

			// Notify background service worker
			chrome.runtime.sendMessage({action: "profileUpdate"});
		}, 500);
	};
});
