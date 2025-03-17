chrome.storage.onChanged.addListener((event) => {
	const profileSection = document.querySelector('[data-profile]');
	const headersSection = profileSection.querySelector('[data-profiles-headers]');

	refreshUI(headersSection);
});

const uiHelpers = {
		createHeaderUI: ({
		name = '',
		value = '',
		disabled = false,
		validationError = ''
	} = {}) => {
		return `
			<div class="profile__header" data-header-group>
				<label>
					Header name
					<input name="name" autocomplete="off" data-header-name value="${name}" ${disabled ? 'disabled' : ''}/>
				</label>

				<label>
					Header value
					<input name="value" autocomplete="off" data-header-value value="${value}" ${disabled ? 'disabled' : ''}/>
				</label>

				<div class="header__error" data-profile-header-error>${validationError}</div>

				<label>
					<input type="checkbox" ${disabled ? 'checked' : ''} data-profile-disable-header />
					Disable header
				</label>
			</div>
		`;
	},
	updateActiveProfileMeta: ({
		id = self.crypto.randomUUID(),
		name = ''
	} = {}) => {
		document.querySelector('[data-profile-id]').value = id;
		document.querySelector('[data-profile-name]').value = name;
	},
	updateProfilePicker: ({ profiles = [], activeProfile = {} }) => {

		if (!profiles.length) {
			return;
		}

		const picker = document.querySelector('[data-profile-picker]');

		picker.innerHTML = '';

		const optionsHtml = profiles.map(profile => {
			const selected = profile.id === activeProfile.id ? 'selected' : '';
			return `<option value="${profile.id}" ${selected}>${profile.name}</option>`;
		}).join('');

		picker.insertAdjacentHTML('afterbegin', optionsHtml)
	}
};

const storage = {
	getCache: async () => {
		const cache = await chrome.storage.local.get();
		const profiles = Object.values(cache).filter(profile => profile.id);
		const { activeProfile } = cache;

		return {
			profiles,
			activeProfile: cache[activeProfile]
		};
	},
	saveProfile: (rootElement) => {
		const profileNameElement = rootElement.querySelector('[data-profile-name]');
		const profileIdElement = rootElement.querySelector('[data-profile-id]');
		const profileId = profileIdElement.value;

		const headers = Array.from(rootElement.querySelectorAll('[data-header-group]'))
			.map(groupElement => {
				const nameElement = groupElement.querySelector('[data-header-name]');
				const valueElement = groupElement.querySelector('[data-header-value]');
				const disabledElement = groupElement.querySelector('[data-profile-disable-header]');
				const errorElement = groupElement.querySelector('[data-profile-header-error]');

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
	},
	setActiveProfile: (newActiveId) => {
		chrome.storage.local.set({ activeProfile: newActiveId});
	}
}

const refreshUI = (headersSection, newProfile = false) => {
	storage.getCache().then(({ profiles, activeProfile }) => {
		/**
		 * Build Header UI
		 */

		headersSection.innerHTML = '';

		const headerUI = !newProfile && activeProfile?.headers?.length ?
			activeProfile.headers.map(headerObject => {
				let validationError = '';

				if (headerObject.header !== '') {
					/**
					 * Don't try and validate headers whilst the name value is still blank
					 */

					try {
						/**
						 * Check if values submitted are valid header characters
						 */

						new Headers([
							[headerObject.header, headerObject.value]
						]);

					} catch (error) {
						validationError = `<p>This header is invalid and it wont sent with requests until it is corrected: ${error}</p>`;
					}
				}

				return uiHelpers.createHeaderUI({
					name: headerObject.header,
					value: headerObject.value,
					disabled: headerObject.disabled,
					validationError
				});
			}).join('') : uiHelpers.createHeaderUI([]);

		headersSection.insertAdjacentHTML('beforeend', headerUI);

		/**
		 * Build Profile UI
		 */

		const profileMeta = !activeProfile || newProfile ?
			{} :
			activeProfile;

		uiHelpers.updateProfilePicker({ profiles, activeProfile });
		uiHelpers.updateActiveProfileMeta(profileMeta);
	});
}

document.addEventListener('DOMContentLoaded', function() {
	const profileSection = document.querySelector('[data-profile]');
	const headersSection = profileSection.querySelector('[data-profiles-headers]');

	refreshUI(headersSection);

	/**
	 * Save when a header is disabled
	 */
	profileSection.addEventListener('click', (event) => {
		const clickTarget = event.target;
		if (clickTarget.hasAttribute('data-profile-disable-header')) {
			storage.saveProfile(profileSection);
		}
	});

	/**
	 * Save the profile when the name or headers are changed
	 */

	profileSection.addEventListener('change', (event) => {
		storage.saveProfile(profileSection);
	});

	/**
	 * Add new header
	 */

	const addNewHeaderButton = document.querySelector('[data-add-new-header]');
	addNewHeaderButton.addEventListener('click', () => {
		headersSection.insertAdjacentHTML('beforeend', uiHelpers.createHeaderUI());
	});

	/**
	 * Pick active profile
	 */
	const profilePicker = document.querySelector('[data-profile-picker]');
	profilePicker.addEventListener('change', (event) => {
		const newActiveId = event.target.value;
		storage.setActiveProfile(newActiveId);

	});

	/**
	 * Create new profile
	 */
	const newProfileButton = document.querySelector('[data-profile-create]');
	newProfileButton.addEventListener('click', (event) => {
		refreshUI(headersSection, true);
	});
});
