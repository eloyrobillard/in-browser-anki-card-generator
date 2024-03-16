import { checkAnkiConnectStatus } from './api.js';

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

