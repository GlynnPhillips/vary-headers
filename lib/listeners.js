import updateProfilePicker from './update-profile-picker';
import createHeaderInput from './create-header-input';
import createProfileUi from './create-profile-ui';
import toggleProfile from './toggle-profile';
import createImportUi from './import-ui';
import importProfile from './import-profile';
import toggleHeader from './toggle-header';
import saveProfile from './save-profile';
import deleteProfile from './delete-profile';
import toggleUndo from './toggle-undo';
import model from './model';

export default () => {
	let keyTimeoutId;
	document.querySelector('[data-profile]').onkeyup = function() {
		clearTimeout(keyTimeoutId);
		keyTimeoutId = setTimeout(function() {
			saveProfile();
		}, 100);
	}

	let clickTimeoutId;
	document.addEventListener('mouseup', (event) => {
		// listen for radio clicks
		if (event.target.getAttribute('type') === 'radio' || event.target.tagName === 'LABEL') {
			clearTimeout(clickTimeoutId);
			clickTimeoutId = setTimeout(() => {
				saveProfile();
			}, 100);
		}
	});

	document.querySelector('[data-profile]').addEventListener('click', (event) => {
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
			createProfileUi(model.active())
			updateProfilePicker();
			toggleUndo(true)
		}
	});

	document.querySelector('[data-banner]').addEventListener('click', (event) => {
		if (event.target.hasAttribute('data-add-profile')) {
			createProfileUi();
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
