import model from './lib/model';
import toggleHeader from './lib/toggle-header';
import saveProfile from './lib/save-profile';
import updateProfilePicker from './lib/update-profile-picker';
import createHeaderUi from './lib/create-header-ui';
import createHeaderInput from './lib/create-header-input';
import createBlankProfile from './lib/blank-profile';
import autoSaveListeners from './lib/auto-save';
import listeners from './lib/listeners';


document.addEventListener('DOMContentLoaded', function() {
	function init() {	
		Promise.all([updateProfilePicker(), createHeaderUi(model.active())])
			.then(() => {
				autoSaveListeners();
				listeners();
			})
	}

	init();
});