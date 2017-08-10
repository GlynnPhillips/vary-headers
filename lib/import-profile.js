import model from './model';
import createProfileUi from './create-profile-ui';
import importUi from './import-ui';
import updateProfilePicker from './update-profile-picker';

export default () => {
	let profiles = model.profiles() || [];
	const newId = profiles.length ? profiles[profiles.length - 1].id + 1 : 1;

	const data = JSON.parse(document.querySelector('[data-import-data]').value);
	let headers = data.headers;

	data.id = newId;
	delete data.filters;
	headers.forEach((header, index) => {
		header.id = index;
	});

	profiles.push(data);
	model.profiles(profiles);
	model.active(newId);
	createProfileUi(model.active());
	updateProfilePicker();
};
