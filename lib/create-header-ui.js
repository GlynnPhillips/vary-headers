import model from './model';
import createHeaderInput from './create-header-input';
import createUserInput from './create-user-input';
import createSessionKeyInput from './create-session-key-input';
import createImportUi from './import-ui';

export default profileId => {

	const profiles = model.profiles() || [];
	let profile;

	document.querySelector('[data-headers]').innerHTML = '';
	document.querySelector('[data-user]').innerHTML = '';

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
		document.querySelector('[data-profile-name]').value = profile.title;
	} else {
		document.querySelector('[data-profile-name]').value = '';
	}

	if (profile && Array.isArray(profile.headers) && profile.headers.length) {
		profile.headers.forEach(header => {
			createHeaderInput(header);
		});

	} else {
		createHeaderInput();
	}

	if(!model.sessionApiKey()) {
		createSessionKeyInput();
	} else if (profile && profile.userType) {
		createUserInput(profile.userType);
	} else {
		createUserInput();
	}
};
