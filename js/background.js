export async function checkAnkiConnectStatus() {
	const ankiConnectPort = 8765;

	const body = {
		"action": "version",
		"version": 6
	};

	return fetch(`http://127.0.0.1:${ankiConnectPort}`, {
		method: 'POST',
		mode: 'cors',
		cache: 'default',
		credentials: 'omit',
		headers: {
			'Content-Type': 'application/json'
		},
		redirect: 'follow',
		referrerPolicy: 'no-referrer',
		body: JSON.stringify(body)
	}).then(res => res.json());
}

chrome.runtime.onMessage.addListener((req, _sender, sendResponse) => {
	console.log(`Received message: ${req.message}`);
	console.log(_sender, sendResponse);
	checkAnkiConnectStatus()
		.then(sendResponse)
		.catch(error => sendResponse({ error }));

	return true;
});
