import createHeaderInput from './create-header-input';
import createHeaderUi from './create-header-ui';
import toggleProfile from './toggle-profile';
import createImportUi from './import-ui';
import importProfile from './import-profile';
import toggleHeader from './toggle-header';
import saveProfile from './save-profile';

export default () => {
	let timeoutId;
	
	document.querySelector('[data-headers-panel]').onkeyup = function() {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(function() {
    		saveProfile();
   		}, 500);
	}
	
	document.querySelector('[data-headers-panel]').onkeyup = function() {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(function() {
    		saveProfile();
   		}, 500);
	}
	

	document.querySelector('[data-headers-panel]').addEventListener('click', (event) => {
		if (event.target.hasAttribute('data-add-header')) {
			createHeaderInput();	
		} else if (event.target.hasAttribute('data-header-disable')) {
			toggleHeader(event);
			event.stopImmediatePropagation()
		}
	});

	document.querySelector('[data-header]').addEventListener('click', (event) => {
		if (event.target.hasAttribute('data-add-profile')) {
			createHeaderUi();
		} else if (event.target.hasAttribute('data-reveal-profiles')) {
			document.querySelector('[data-profile-picker]').classList.toggle('profile-picker--reveal');	
		} else if (event.target.hasAttribute('data-import-profile')) {
			createImportUi();
		}
	});

	document.querySelector('[data-profile-picker]').addEventListener('click', (event) => {
		const profileId = event.target.getAttribute('data-profile-id');
		if (profileId) {
			toggleProfile(profileId)
		}
	});
	
	document.querySelector('[data-import-save]').addEventListener('click', importProfile);
};
