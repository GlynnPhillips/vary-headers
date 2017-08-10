import model from './model';
import createProfileUi from './create-profile-ui';
import updateProfilePicker from './update-profile-picker';


export default (id) => {
	createProfileUi(id);
	model.active(id);
	updateProfilePicker();
}