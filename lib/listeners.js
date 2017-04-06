import selectors from './selectors';
import createHeaderInput from './create-header-input';
import createBlankProfile from './blank-profile';
import toggleProfile from './toggle-profile';
import createImportUi from './import-ui';
import importProfile from './import-profile';

export default () => {
	document.querySelector(selectors.addHeader).addEventListener('click', createHeaderInput);
	document.querySelector(selectors.addProfile).addEventListener('click', createBlankProfile);

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
};