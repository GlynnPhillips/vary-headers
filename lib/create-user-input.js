import model from './model';
import user from './user';

export default (thisUser) => {
	const users = [''].concat(Object.keys(user.getTypes()));
	let userType;
	if (thisUser) {
		userType = thisUser;
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
