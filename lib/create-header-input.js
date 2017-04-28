import model from './model';
import toggleHeader from './toggle-header';

export default (header = {}) => {
	let id;
	if (header && header.id) {
		id = header.id;
	} else {
		const profile = model.profile(localStorage.getItem('activeProfile'));
		id = profile && (profile.headers && profile.headers.length) ? parseInt(profile.headers[profile.headers.length - 1].id) + 1 : 1;
	}
	
	header.name = header.name ? header.name : '';
	header.value = header.value ? header.value : '';

	let elements = `<div data-header data-header-id="${id}" class="profile__header">
		<input data-header-name placeholder="Header name" class="profile__header-input" value="${header.name}"/> 
		<input data-header-value placeholder="Header value" class="profile__header-input" value="${header.value}"/> 
		<button data-header-disable>Disable</button>
	</div>`;
	
	// Create DOM nodes from template string
	const nodes = document.createRange().createContextualFragment(elements);	
	document.querySelector('[data-headers]').appendChild(nodes);

	if (header && !header.enabled && (header.name || header.value)) {
		toggleHeader(null, id)
	}

	return Promise.resolve();
};
