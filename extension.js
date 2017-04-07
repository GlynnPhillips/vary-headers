import updateProfilePicker from './lib/update-profile-picker';
import createHeaderUi from './lib/create-header-ui';
import listeners from './lib/listeners';


document.addEventListener('DOMContentLoaded', function() {
	updateProfilePicker();
	createHeaderUi();
	listeners();
});
