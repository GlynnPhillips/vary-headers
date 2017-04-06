import saveProfile from './save-profile';

export default (event, id) => {
	
	let config = {
		disabled: {
			class: 'profile__header--disabled',
			on: {
				text: 'Disable'
			},
			off: {
				text: 'Enable'
			}
		}
	};

	const header = id ? document.querySelector(`[data-header-id="${id}"]`) : event.target.parentNode;

	header.classList.toggle(config.disabled.class);
	
	if (id) {
		document.querySelector(`[data-header-id="${id}"]`).querySelector('[data-header-disable]').innerHTML = config.disabled.off.text;

	} else {
		console.log(event.target.parentNode)
		if (header.querySelector('[data-header-disable]').innerHTML === config.disabled.off.text) {
			header.querySelector('[data-header-disable]').innerHTML = config.disabled.on.text;
		} else {
			header.querySelector('[data-header-disable]').innerHTML = config.disabled.off.text;
		}

		saveProfile();
	}
}