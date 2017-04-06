import model from './model';
import selectors from './selectors';
import createHeaderInput from './create-header-input';
import createImportUi from './import-ui';

export default profileId => {
	
	const profiles = model.profiles() || [];
	let profile;

	document.querySelector(selectors.headersForm).innerHTML = '';
	
	if (!profileId) {
		const newId = profiles[profiles.length - 1] ? parseInt(profiles[profiles.length - 1].id) + 1 : 1;
		model.active(newId);
	} else {
		profile = model.profile(profileId);
	}

	if (document.querySelector('[data-import-panel]').classList.contains('import--reveal')) {
		createImportUi()
	}
	
	if (profile && profile.title) {
		document.querySelector(selectors.profileName).value = profile.title;
	} else {
		document.querySelector(selectors.profileName).value = '';
	}

	if (profile && profile.headers) {
		profile.headers.forEach(header => {
			createHeaderInput(header);
		});
	} else {
		createHeaderInput();
	}

	return Promise.resolve();
};