import model from './model';

export default () => {
	const profiles = model.profiles();
	const picker = document.querySelector('[data-profile-picker]');
	picker.classList.remove('profile-picker--reveal');
	// show profile picker if there are 2 or more profiles
	if (Array.isArray(profiles) && profiles.length > 1) {
		picker.innerHTML = '';
		profiles.forEach(profile => {
			const active = profile.id === model.active();
			const button = document.createElement('button');
			
			button.classList.add('profile__button');
			button.setAttribute('data-profile-id', profile.id);
			if (active) {
				button.classList.add('profile__button--selected');
			}
			button.innerHTML = profile.title;	

			picker.appendChild(button)
		});

		picker.classList.add('profile-picker--reveal');
	}
};
