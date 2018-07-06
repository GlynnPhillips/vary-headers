import updateProfilePicker from './lib/update-profile-picker';
import createHeaderUi from './lib/create-header-ui';
import listeners from './lib/listeners';
import model from './lib/model';
import user from './lib/user';

document.addEventListener('DOMContentLoaded', async function() {
	await user.init();
	updateProfilePicker();
	createHeaderUi(model.active());
	listeners();
});
