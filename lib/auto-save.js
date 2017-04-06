import selectors from './selectors';
import saveProfile from './save-profile';

export default () => {	
	let timeoutId;

	document.querySelector(selectors.profileName).onkeyup = function() {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(function() {
    		saveProfile();
   		}, 500);
	}
	
	document.querySelector(selectors.headersForm).onkeyup = function() {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(function() {
    		saveProfile();
   		}, 500);
	}
	
	return;
};
