import model from './model';

export default () => {

	let elements = `<div data-session-key class="profile__session-key">
		<input name="session-key" placeholder="Enter API key for test sessions API"/>
		<button data-save-session-key class="profile__session-key-save">Save</button>
	</div>`;

	// Create DOM nodes from template string
	const nodes = document.createRange().createContextualFragment(elements);
	document.querySelector('[data-user]').appendChild(nodes);

	return Promise.resolve();
};
