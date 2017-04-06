import model from './model';
import createHeaderUi from './create-header-ui';
import updateProfilePicker from './update-profile-picker';


export default (id) => {
	createHeaderUi(id);
	model.active(id);
	updateProfilePicker();
}