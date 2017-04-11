import updateProfilePicker from './lib/update-profile-picker';
import createHeaderUi from './lib/create-header-ui';
import listeners from './lib/listeners';
import model from './lib/model';

document.addEventListener('DOMContentLoaded', function() {
	updateProfilePicker();
	createHeaderUi(model.active());
	listeners();
});
