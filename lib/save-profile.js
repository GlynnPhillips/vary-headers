import model from './model';
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

function getAws() {
	return {
		euWest1: document.querySelector('[data-aws-eu-west-1]').checked,
		usEast1: document.querySelector('[data-aws-us-east-1]').checked,
		accessKeyId: document.querySelector('[data-aws-access-key-id]').value,
		secretAccessKey: document.querySelector('[data-aws-secret-access-key]').value
	};
}

export default (profile) => {
	
	const profiles = model.profiles() || [];
	
	if (profile) {
		const profileIndex = profiles.findIndex((item) => {return item.id === profile.id});
		
		if (profileIndex > -1) {
			profile.id = parseInt(profiles[profiles.length - 1].id) + 1;
		}
		profiles.push(profile);	
		model.profiles(profiles);
		model.active(profile.id);
	} else {
		const headerInputs = document.querySelectorAll('[data-header]');
		const headers = formatHeaders(headerInputs);
		const aws = getAws();
		
		const profile = model.profile(model.active());
		let updateName = false;
		
		if (!profile) {
			profiles.push({
				id: model.active(),
				title: document.querySelector('[data-profile-name]').value,
				headers,
				aws
			});

			model.profiles(profiles);
			model.active(model.active());
			updateProfilePicker();
		} else {
			profile.title = document.querySelector('[data-profile-name]').value;
			profile.headers = headers;
			profile.aws = aws;

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
}
