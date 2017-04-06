import model from './model';
import selectors from './selectors';

export default () => {
	const profiles = model.profiles();
	if (profiles) {
		document.querySelector(selectors.profilePicker).innerHTML = '';
		profiles.forEach(profile => {
			const active = profile.id === model.active();
			const button = document.createElement('button');
			
			button.classList.add('profile__button');
			button.setAttribute('data-profile-id', profile.id);
			if (active) {
				button.classList.add('profile__button--selected');
			}
			button.innerHTML = profile.title;	

			document.querySelector(selectors.profilePicker).appendChild(button)
		});
	}
	return Promise.resolve();
};