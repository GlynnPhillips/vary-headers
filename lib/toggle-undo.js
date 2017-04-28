export default (hide) => {
	
	const button = `<button data-delete-undo class="undo-button undo-button--visible">Undo Delete</button>`;
	const nodes = document.createRange().createContextualFragment(button);
	const headersPanel = document.querySelector('[data-headers-panel]');	
	
	if (hide) {
		headersPanel.removeChild(document.querySelector('[data-delete-undo]'));
	} else {
		if (document.querySelector('[data-delete-undo]')) {
			headersPanel.removeChild(document.querySelector('[data-delete-undo]'));
		}
		headersPanel.appendChild(nodes);
	}
}
