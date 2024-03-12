import { checkAnkiConnectStatus } from './api.js';

function createPopup() {
	const url = chrome.runtime.getURL('./open-card-generator.html');

	/** @type {chrome.windows.CreateData} */
	const popup = {
		height: 100,
		width: 100,
		top: 0,
		left: 0,
		state: 'normal',
		type: 'popup',
		url
	}

	return new Promise((resolve, reject) => {
		chrome.windows.create(
			popup,
			(result) => {
				const error = chrome.runtime.lastError;
				if (error) {
					reject(new Error(error.message));
				} else {
					resolve(/** @type {chrome.windows.Window} */(result));
				}
			}
		);
	});
}

/**
 * @param {boolean} ankiConnected
 */
function updateAnkiConnectionStatus(ankiConnected) {
	if (ankiConnected) {
		const ankiStatusDiv = document.getElementById('anki-connect-status');

		if (ankiStatusDiv) {
			ankiStatusDiv.textContent = 'Connected';
		}
	}
}

await checkAnkiConnectStatus(res => {
	if (res && typeof res === 'object' && 'result' in res) {
		updateAnkiConnectionStatus(!!res.result)
	}
});

