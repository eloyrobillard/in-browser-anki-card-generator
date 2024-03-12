/**
 * @param {(...args: any) => void} f
 */
function debounce(f, delay = 500) {
	let timeout;
	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => f.apply(this, args), delay);
	}
}

document.addEventListener('selectionchange', debounce(() => {
	const selection = document.getSelection();
	if (selection) {
		if (selection) {
			const rect = selection.getRangeAt(0).getBoundingClientRect();
			chrome.runtime.sendMessage({ message: 'create popup', data: rect }, console.log);
		}

		console.log(selection.toString());
	}
}));

