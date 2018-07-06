import model from './model';

let TYPES;

const TEST_SESSIONS_URL = 'https://fuhn0pye67.execute-api.eu-west-1.amazonaws.com/prod';

function setCookies(userCookies) {
	console.log(userCookies);
	const url = 'https://www.ft.com';
	chrome.cookies.remove({ url, name: 'FTSession' });
	chrome.cookies.remove({ url, name: 'FTSession_s' });

	if(userCookies) {
		chrome.cookies.set({ url, name: 'FTSession', value: userCookies['FTSession'], domain: '.ft.com' });
		chrome.cookies.set({ url, name: 'FTSession_s', value: userCookies['FTSession_s'], secure: true, domain: '.ft.com' });
	};
}

async function getCookies(userType) {
	const apiKey = model.sessionApiKey();
	if(apiKey && userType && userType !== '') {
		return fetch(`${TEST_SESSIONS_URL}/${TYPES[userType]}?api_key=${apiKey}`)
			.then(res => res.json())
			.then(res => {
				return res;
			})
			.catch((err) => {
				console.error('Failed to set user type', err);
			});
	}
}
async function init() {
	const apiKey = model.sessionApiKey();
	await fetch(`${TEST_SESSIONS_URL}/list`)
		.then(res => res.json())
		.then(res => {
			console.log('got types', res);
			TYPES = res;
		})
		.catch((err) => {
			console.error('Failed to set user type', err);
			TYPES = {};
		});
}

export default {
	getTypes: () => TYPES,
	init,
	getCookies,
	setCookies
};

