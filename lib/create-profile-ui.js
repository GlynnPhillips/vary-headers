import model from './model';
import createHeaderInput from './create-header-input';
import createImportUi from './import-ui';

export default profileId => {
	
	const profiles = model.profiles() || [];
	let profile;

	document.querySelector('[data-headers]').innerHTML = '';
	
	if (!profileId) {
		const newId = profiles[profiles.length - 1] ? parseInt(profiles[profiles.length - 1].id) + 1 : 1;
		model.active(newId);
	} else {
		profile = model.profile(profileId);
	}

	if (document.querySelector('[data-import-panel]').classList.contains('import--reveal')) {
		createImportUi()
	}
	
	if (profile && profile.title) {
		document.querySelector('[data-profile-name]').value = profile.title;
	} else {
		document.querySelector('[data-profile-name]').value = '';
	}

	if (profile && Array.isArray(profile.headers) && profile.headers.length) {
		profile.headers.forEach(header => {
			createHeaderInput(header);
		});
	} else {
		createHeaderInput();
	}

	if (profile && profile.aws) {
		const aws = profile.aws;
		document.querySelector('[data-aws-eu-west-1]').checked = aws.euWest1;
		document.querySelector('[data-aws-us-east-1]').checked = aws.usEast1;
		document.querySelector('[data-aws-access-key-id]').value = aws.accessKeyId;
		document.querySelector('[data-aws-secret-access-key]').value = aws.secretAccessKey;
	} else {
		document.querySelector('[data-aws-eu-west-1]').checked = false;
		document.querySelector('[data-aws-us-east-1]').checked = false
		document.querySelector('[data-aws-access-key-id]').value = '';
		document.querySelector('[data-aws-secret-access-key]').value = '';
	}
};
