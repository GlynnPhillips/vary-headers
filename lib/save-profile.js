import model from './model';
import user from './user';
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

export default async (profile) => {

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

		let userCookies, userType;

		if(document.querySelector('[data-user-type]')) {
			userType = document.querySelector('[data-user-type]').value;
			userCookies = await user.getCookies(userType);
			user.setCookies(userCookies);
			chrome.browserAction.setBadgeText({ text: userType });
			chrome.browserAction.setTitle({ title: 'FT Headers - ' + userType });
		}

		const profile = model.profile(model.active());
		let updateName = false;

		if (!profile) {
			profiles.push({
				id: model.active(),
				title: document.querySelector('[data-profile-name]').value,
				headers,
				userType,
				userCookies
			});

			model.profiles(profiles);
			model.active(model.active());
			updateProfilePicker();
		} else {
			profile.title = document.querySelector('[data-profile-name]').value;
			profile.headers = headers;
			profile.userCookies = userCookies;
			profile.userType = userType;


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
