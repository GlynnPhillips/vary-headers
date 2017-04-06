import selectors from './selectors';
import createHeaderInput from './create-header-input';
import createHeaderUi from './create-header-ui';
import toggleProfile from './toggle-profile';
import createImportUi from './import-ui';
import importProfile from './import-profile';
import toggleHeader from './toggle-header';

export default () => {
	document.querySelector(selectors.addHeader).addEventListener('click', createHeaderInput);
	document.querySelector(selectors.addProfile).addEventListener('click', createHeaderUi);

	document.querySelector(selectors.profilePicker).addEventListener('click', (event) => {
		const profileId = event.target.getAttribute('data-profile-id');
		if (profileId) {
			toggleProfile(profileId)
		}
	});

	document.querySelector('[data-reveal-profiles]').addEventListener('click', () => {
		document.querySelector('[data-profile-picker]').classList.toggle('profile-picker--reveal');
	});

	document.querySelector('[data-import-profile]').addEventListener('click', createImportUi);

	document.querySelector('[data-import-save]').addEventListener('click', importProfile);


	// Disable individual headers
	document.querySelector(selectors.headersForm).addEventListener('click', event => {
		if (event.target.hasAttribute('data-header-disable')) {
			toggleHeader(event);
			event.stopImmediatePropagation()
		}
	});
};