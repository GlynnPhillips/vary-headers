
chrome.storage.onChanged.addListener((event) => {
		chrome.storage.local.get().then(cache => {
			const profiles = Object.values(cache).filter(profile => profile.id);
			const { activeProfile } = cache;

			updateProfilePicker(profiles, activeProfile);
		})
	}
);

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


const updateActiveProfileMeta = ({
	id = self.crypto.randomUUID(),
	name = ''
} = {}) => {
	document.querySelector('[data-profile-id]').value = id;
	document.querySelector('[data-profile-name]').value = name;
};

const updateProfilePicker = (profiles = [], activeProfile) => {
	const picker = document.querySelector('[data-profile-picker]');

	picker.innerHTML = '';

	const optionsHtml = profiles.map(profile => {
		const selected = profile.id === activeProfile ? 'selected' : '';
		return `<option value="${profile.id}" ${selected}>${profile.name}</option>`;
	}).join('');

	picker.insertAdjacentHTML('afterbegin', optionsHtml)
};

const saveProfile = ({
	rootElement
}) => {

	const profileNameElement = rootElement.querySelector('[data-profile-name]');
	const profileIdElement = rootElement.querySelector('[data-profile-id]');
	const profileId = profileIdElement.value;

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

			if (nameElement.value !== '') {
				/**
				 * Don't try and validate headers whilst the name value is still blank
				 */
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
			}

			return {
				header: nameElement.value,
				value: valueElement.value,
				disabled: disabledElement.checked
			}
		}).filter(headerObject => {
			return headerObject.header !== '' && headerObject.value !== ''
		});

	const profile = {
		id: profileIdElement.value,
		name: profileNameElement.value,
		headers
	};

	const cache = {};

	cache[profileId] = profile

	chrome.storage.local.set(cache);

	const activeProfile = profileId;
	chrome.storage.local.set({ activeProfile });

	updateProfilePicker()
}


document.addEventListener('DOMContentLoaded', function() {

	const profileSection = document.querySelector('[data-profile]');
	const headersSection = profileSection.querySelector('[data-profiles-headers]');

	profileSection.addEventListener('click', (event) => {
		const clickTarget = event.target;
		if (clickTarget.hasAttribute('data-profile-disable-header')) {
			saveProfile({
				rootElement: profileSection
			});
		}
	});


	/**
	 * Load existing headers from storage
	 */

	chrome.storage.local.get().then(cache => {
		const profiles = Object.values(cache).filter(profile => profile.id);
		const { activeProfile } = cache;

		/**
		 * Build Profile UI
		 */

		if (!activeProfile) {
			updateActiveProfileMeta({});
			updateProfilePicker([]);
		} else {
			const profileName = cache[activeProfile].name;
			const profileId = cache[activeProfile].id;

			updateActiveProfileMeta({
				id: profileId,
				name: profileName
			});

			updateProfilePicker(profiles, activeProfile);
		}



		/**
		 * Build header UI
		 */
		if (!profiles || !profiles[0]?.headers?.length) {
			headersSection.insertAdjacentHTML('beforeend', createHeaderUI());
		} else {
			const existingHeaderUI = cache[activeProfile].headers.map(headerObject => {
				return createHeaderUI({
					name: headerObject.header,
					value: headerObject.value,
					disabled: headerObject.disabled
				});
			});

			headersSection.insertAdjacentHTML('beforeend', existingHeaderUI.join(''));
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
		headersSection.insertAdjacentHTML('beforeend', createHeaderUI());
	});

	/**
	 * Pick active profile
	 */
	const profilePicker = document.querySelector('[data-profile-picker]');

	profilePicker.addEventListener('change', (event) => {

		const newActiveId = event.target.value;

		chrome.storage.local.set({ activeProfile: newActiveId});

		chrome.storage.local.get(newActiveId).then(cache => {
			const profile = cache[newActiveId];

			updateActiveProfileMeta({
				id: profile.id,
				name: profile.name
			});

			headersSection.innerHTML = '';

			const existingHeaderUI = profile.headers.map(headerObject => {
				return createHeaderUI({
					name: headerObject.header,
					value: headerObject.value,
					disabled: headerObject.disabled
				});
			});

			headersSection.insertAdjacentHTML('beforeend', existingHeaderUI.join(''));
		});

	});

	/**
	 * Create new profile
	 */
	const newProfileButton = document.querySelector('[data-profile-create]');

	newProfileButton.addEventListener('click', (event) => {
		updateActiveProfileMeta();

		headersSection.innerHTML = '';
		headersSection.insertAdjacentHTML('beforeend', createHeaderUI());

	});
});
