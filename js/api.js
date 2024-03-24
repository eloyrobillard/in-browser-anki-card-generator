export async function checkAnkiConnectStatus() {
    return chrome.runtime.sendMessage({ message: 'connect' });
}

export async function getCardModels() {
    return chrome.runtime.sendMessage({ message: 'models' });
}

export async function getDecks() {
    return chrome.runtime.sendMessage({ message: 'decks' });
}

export async function getFields() {
    return chrome.runtime.sendMessage({ message: 'fields' });
}

export async function guiAddCards(fieldContent) {
    return chrome.runtime.sendMessage({ message: 'guiAddCards', fieldContent });
}
