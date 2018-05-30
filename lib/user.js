import model from './model';

const TYPES = {
	'standard': 'standard',
	'premium': 'premium',
	'expired': 'expired',
	'registered': 'fresh-registered'
};

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
		return fetch(`https://fuhn0pye67.execute-api.eu-west-1.amazonaws.com/prod/${TYPES[userType]}?api_key=${apiKey}`)
			.then(res => res.json())
			.then(res => {
				return res;
			})
			.catch((err) => {
				console.error('Failed to set user type', err);
			});
	}
}

export default {
	TYPES,
	getCookies,
	setCookies
};

