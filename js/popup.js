import { checkAnkiConnectStatus } from './backend';

const ankiConnected = checkAnkiConnectStatus();

if (ankiConnected) {
	const ankiStatusDiv = document.getElementById('anki-connect-status');

	ankiStatusDiv.textContent = 'Connected';
}
