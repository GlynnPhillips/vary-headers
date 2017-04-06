import model from './model';
import selectors from './selectors';
import createHeaderInput from './create-header-input';

export default (profileId = model.active()) => {
	const profiles = model.profiles() || [];
	const profile = model.profile(profileId);	
	
	document.querySelector(selectors.headersForm).innerHTML = '';

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