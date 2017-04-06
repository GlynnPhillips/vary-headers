import model from './model';
import selectors from './selectors';
import createHeaderInput from './create-header-input';
import createImportUi from './import-ui';


export default () => {
	
	if (document.querySelector('[data-import-panel]').classList.contains('import--reveal')) {
		createImportUi()
	}
	const profiles = model.profiles() || [];
	const newId = profiles[profiles.length - 1] ? parseInt(profiles[profiles.length - 1].id) + 1 : 1;
	model.active(newId);
	
	document.querySelector(selectors.headersForm).innerHTML = '';
	document.querySelector(selectors.profileName).value = '';
	createHeaderInput()

	return Promise.resolve();
};
