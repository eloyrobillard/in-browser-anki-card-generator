export async function checkAnkiConnectStatus() {
	const ankiConnectPort = 8765;

	const res = await fetch(`127.0.0.1:${ankiConnectPort}`);
	console.log(res);
	return true;
}

