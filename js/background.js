export function createPopup(top, left) {
	const url = chrome.runtime.getURL('./open-card-generator.html');

	/** @type {chrome.windows.CreateData} */
	const popup = {
		height: 100,
		width: 100,
		top: Math.trunc(top),
		left: Math.trunc(left),
		state: 'normal',
		type: 'popup',
		url
	}

	return new Promise((resolve, reject) => {
		// TODO content-scriptでappend()にする？
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
		case 'create popup': {
			//		const { top, left } = msg.data;
			//		return createPopup(top, left);
		}
	}

	return true;
});
