import model from './model';
import updateProfilePicker from './update-profile-picker';
import createProfileUi from './create-profile-ui';
import toggleUndo from './toggle-undo';


export default () => {
	let profiles = model.profiles() || [];
	const profile = model.profile(model.active());
	const profileIndex = profiles.findIndex((item) => {return item.id === profile.id});
	
	model.backup(profile);		
	profiles.splice(profileIndex, 1);
	const newActive = profiles.length ? profiles[profiles.length -1].id : 1;
		
	model.profiles(profiles);
	model.active(newActive);
	createProfileUi(newActive);
	updateProfilePicker();
	toggleUndo();
}
