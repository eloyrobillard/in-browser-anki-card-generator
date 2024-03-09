/**
 * @param {(response: unknown) => void} cb
 */
export async function checkAnkiConnectStatus(cb) {
	try {
		chrome.runtime.sendMessage({ message: 'connect' }, cb);
	} catch (error) {
		console.error(error);
	}
}


