import updateProfilePicker from './lib/update-profile-picker';
import createProfileUi from './lib/create-profile-ui';
import listeners from './lib/listeners';
import model from './lib/model';

document.addEventListener('DOMContentLoaded', function() {
	updateProfilePicker();
	createProfileUi(model.active());
	listeners();
});
