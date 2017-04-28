const model = {
	profiles: (data) => {
		if (data) {
			localStorage.setItem('profiles', JSON.stringify(data));
		}	
		return JSON.parse(localStorage.getItem('profiles'));
	},
	profile: (id) => {
		const profiles = JSON.parse(localStorage.getItem('profiles'));
	
		const profile = profiles ? profiles.find(profileObject => {
			return profileObject.id === parseInt(id);
		}) : null;

		return profile;
	},
	active: (id) => {

		if (id) {
			localStorage.setItem('activeProfile', id);
		}

		return localStorage.getItem('activeProfile') ? parseInt(localStorage.getItem('activeProfile')) : 1;	
	},
	backup: (profile) => {
		if (profile) {
			sessionStorage.setItem('backupProfile', JSON.stringify(profile));
		}

		return JSON.parse(sessionStorage.getItem('backupProfile'));
	}	
}

export default model;
