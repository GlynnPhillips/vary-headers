import updateProfilePicker from './update-profile-picker';
import createHeaderInput from './create-header-input';
import createHeaderUi from './create-header-ui';
import toggleProfile from './toggle-profile';
import createImportUi from './import-ui';
import importProfile from './import-profile';
import toggleHeader from './toggle-header';
import saveProfile from './save-profile';
import deleteProfile from './delete-profile';
import toggleUndo from './toggle-undo';
import model from './model';

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
    		saveProfile();
			createHeaderInput();	
		} else if (event.target.hasAttribute('data-header-disable')) {
			toggleHeader(event);
			event.stopImmediatePropagation()
		} else if (event.target.hasAttribute('data-profile-delete')) {
			deleteProfile();
		} else if (event.target.hasAttribute('data-delete-undo')) {
			saveProfile(model.backup());
			createHeaderUi(model.active())
			updateProfilePicker();
			toggleUndo(true)
		}
	});

	document.querySelector('[data-banner]').addEventListener('click', (event) => {
		if (event.target.hasAttribute('data-add-profile')) {
			createHeaderUi();
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
