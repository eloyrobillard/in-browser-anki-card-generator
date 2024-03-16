/**
 * @param {(...args: any) => void} f
 */
function debounce(f, delay = 500) {
	/** @type {number} */
	let timeout;
	return (/** @type {any[]} */ ...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => f(args), delay);
	}
}

/**
 * @param {number} top
 * @param {number} left
 */
function createIframe(top, left) {
	const iframe = document.createElement('iframe');

	iframe.id = 'anki-generator-frame';
	iframe.style.top = `${String(top)}px`;
	iframe.style.left = `${String(left)}px`;
	iframe.style.position = 'absolute';
	iframe.style.width = '50px';
	iframe.style.height = '50px';

	const url = chrome.runtime.getURL('/button.html');
	iframe.setAttribute('src', url);

	return iframe;
}

document.addEventListener('selectionchange', debounce(() => {
	const selection = document.getSelection();

	const iframe = document.getElementById('anki-generator-frame');

	if (selection && selection.toString() && !iframe) {
		const rect = selection.getRangeAt(0).getBoundingClientRect();
		const newIframe = createIframe(rect.top, rect.left);

		document.body.appendChild(newIframe);
	}
}));

document.addEventListener('mousedown', () => {
	const iframe = document.getElementById('anki-generator-frame');

	if (iframe) document.body.removeChild(iframe);
});
