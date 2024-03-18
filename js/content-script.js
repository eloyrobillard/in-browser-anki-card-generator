/**
 * @param {Document} a
 */
function getScrollingElement(a) {
	return a.scrollingElement ? a.scrollingElement : a.compatMode === "CSS1Compat" ? a.documentElement : a.body || a.documentElement;
}

/**
 * @param {(...args: any) => void} f
 */
function debounce(f, delay = 500) {
	/** @type {number} */
	let timeout;
	return (/** @type {any[]} */ ...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => f(...args), delay);
	}
}

/**
 * @param {number} top
 * @param {number} left
 */
function createButton(top, left) {
	const button = document.createElement('div');

	button.id = 'anki-generator-frame';
	button.style.top = `${String(top)}px`;
	button.style.left = `${String(left)}px`;
	button.style.position = 'absolute';
	button.style.width = '19px';
	button.style.height = '19px';
	button.style.backgroundSize = '19px';
	button.style.backgroundImage = `url(${chrome.runtime.getURL('/assets/anki.ico')})`;

	return button;
}

document.addEventListener('mouseup', debounce((e) => {
	const selection = window.getSelection();
	const button = document.getElementById('anki-generator-frame');

	if (selection?.toString() && !button) {
		const scroll = getScrollingElement(document);
		const top = e.clientY + scroll.scrollTop;
		const left = e.clientX + scroll.scrollLeft - 13;

		const newbutton = createButton(top, left);

		document.body.appendChild(newbutton);
	}
}));

document.addEventListener('mousedown', () => {
	const button = document.getElementById('anki-generator-frame');

	if (button) document.body.removeChild(button);
});
