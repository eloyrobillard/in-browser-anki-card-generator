
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

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
	console.log('Received message:', msg);

	switch (msg.message) {
		case 'connect':
			checkAnkiConnectStatus()
				.then(sendResponse)
				.catch(error => sendResponse({ error }));
			break;
	}

	return true;
});
