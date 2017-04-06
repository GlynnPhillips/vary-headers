import model from './model';
import selectors from './selectors';
import updateProfilePicker from './update-profile-picker';

function formatHeaders(inputs) {
	const headers = [];
	Array.from(inputs).forEach(header => {
		const headerObject = {
			id: header.getAttribute('data-header-id'),
			name: header.querySelector('[data-header-name]').value,
			value: header.querySelector('[data-header-value]').value,
			enabled: header.classList.contains('profile__header--disabled') ? false : true
		};
		
		if (headerObject.name || headerObject.value) {	
			headers.push(headerObject);
		}
	});	

	return headers;	
}


export default () => {

	const headerInputs = document.querySelectorAll('[data-header]');
	const headers = formatHeaders(headerInputs);
	
	const profile = model.profile(model.active());
	const profiles = model.profiles() || [];
	let updateName = false;
	
	if (!profile) {
		profiles.push({
			id: model.active(),
			title: document.querySelector(selectors.profileName).value,
			headers
		});

		model.profiles(profiles);
		model.active(model.active());
		updateProfilePicker();
	} else {
		profile.title = document.querySelector(selectors.profileName).value;
		profile.headers = headers;
		

		profiles.forEach((profileObject, index) => {

			if (profileObject.id === profile.id) {
				if (profileObject.title !== profile.title) {
					updateName = true;
				}
				
				profiles[index] = profile;
			}
		});

		model.profiles(profiles);
		model.active(profile.id);
	}

	
	if (updateName) {
		updateProfilePicker();
	}
}