import model from './model';
import user from './user';

const users = [''].concat(Object.keys(user.TYPES));

export default (user) => {
	let userType;
	if (user) {
		userType = user;
	} else {
		const profile = model.profile(localStorage.getItem('activeProfile'));
		userType = profile && profile.userType || '';
	}

	let elements = `<div data-user class="profile__user">
        <select class="profile__user-select" name="user-type" data-user-type="${userType}">
            ${users.map(type => `<option ${type === userType ? 'selected ' : ''} value="${type}">${type}</option>`)}
        </select>
	</div>`;

	// Create DOM nodes from template string
	const nodes = document.createRange().createContextualFragment(elements);
	document.querySelector('[data-user]').appendChild(nodes);

	return Promise.resolve();
};
