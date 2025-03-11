const createHeaderUI = ({
	name = '',
	value = '',
	disabled = false
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

			<div class="header__error" data-profile-header-error></div>

			<label>
				Disable header
				<input type="checkbox" ${disabled ? 'checked' : ''} data-profile-disable-header />
			</label>
		</div>
	`;
};

const createProfileUI = ({
	profileName = '',
} = {}) => {
	return `
		<label>
			Profile name
			<input name="name" autocomplete="off" data-profile-name value="${profileName}"/>
		</label>
	`;
};

const saveProfile = ({
	rootElement
}) => {

	const profileNameElement = rootElement.querySelector('[data-profile-name]');

	const headers = Array.from(rootElement.querySelectorAll('[data-header-group]'))
		.map(groupElement => {
			const nameElement = groupElement.querySelector('[data-header-name]');
			const valueElement = groupElement.querySelector('[data-header-value]');
			const disabledElement = groupElement.querySelector('[data-profile-disable-header]');
			const errorElement = groupElement.querySelector('[data-profile-header-error]');

			/**
			 * Clean up the error message before the next validation
			 */
			errorElement.innerHTML = '';

			try {
				/**
				 * Check if values submitted are valid header characters
				 */

				new Headers([
					[nameElement.value, valueElement.value]
				]);
			} catch (error) {
				errorElement.insertAdjacentHTML('afterBegin', `<p>This header is invalid and it wont sent with requests until it is corrected: ${error}</p>`);
			}

			return {
				header: nameElement.value,
				value: valueElement.value,
				disabled: disabledElement.checked
			}
		}).filter(headerObject => {
			return headerObject.header !== '' && headerObject.value !== ''
		});

	const profiles = [
		{
			name: profileNameElement.value,
			headers
		}
	];

	chrome.storage.sync.set({ profiles });

	// Notify background service worker
	chrome.runtime.sendMessage({action: "profileUpdate"});
}


document.addEventListener('DOMContentLoaded', function() {

	const profileSection = document.querySelector('[data-profile]');

	profileSection.addEventListener('click', (event) => {
		const clickTarget = event.target;
		if (clickTarget.hasAttribute('data-profile-disable-header')) {
			saveProfile({
				rootElement: profileSection
			});
		}
	})


	/**
	 * Load existing headers from storage
	 */
	chrome.storage.sync.get('profiles', function(cache) {
		const { profiles } = cache;

		/**
		 * Build Profile UI
		 */

		const profileName = profiles[0].name || '';
		profileSection.insertAdjacentHTML('afterBegin', createProfileUI({
			profileName
		}));

		/**
		 * Build header UI
		 */
		if (!profiles || !profiles[0]?.headers?.length) {
			profileSection.insertAdjacentHTML('beforeend', createHeaderUI());
		} else {
			const existingHeaderUI = profiles[0].headers.map(headerObject => {
				return createHeaderUI({
					name: headerObject.header,
					value: headerObject.value,
					disabled: headerObject.disabled
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
			saveProfile({
				rootElement: profileSection
			});
		}, 500);
	};

	/**
	 * Add new header
	 */

	const addNewHeaderButton = document.querySelector('[data-add-new-header]');

	addNewHeaderButton.addEventListener('click', () => {
		profileSection.insertAdjacentHTML('beforeend', createHeaderUI());
	});

});
