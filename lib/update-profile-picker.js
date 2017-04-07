import model from './model';

export default () => {
	const profiles = model.profiles();
	if (profiles) {
		document.querySelector('[data-profile-picker]').innerHTML = '';
		profiles.forEach(profile => {
			const active = profile.id === model.active();
			const button = document.createElement('button');
			
			button.classList.add('profile__button');
			button.setAttribute('data-profile-id', profile.id);
			if (active) {
				button.classList.add('profile__button--selected');
			}
			button.innerHTML = profile.title;	

			document.querySelector('[data-profile-picker]').appendChild(button)
		});
	}
};
