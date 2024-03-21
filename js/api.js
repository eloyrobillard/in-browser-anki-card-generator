export async function checkAnkiConnectStatus() {
    return new Promise((resolve) => chrome.runtime.sendMessage({ message: 'connect' }, resolve));
}

export async function getCardModels() {
    return new Promise((resolve) => chrome.runtime.sendMessage({ message: 'models' }, resolve));
}
