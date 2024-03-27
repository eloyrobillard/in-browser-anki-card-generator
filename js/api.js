export async function checkAnkiConnectStatus() {
    return browser.runtime.sendMessage({ message: 'connect' });
}

export async function getCardModels() {
    return browser.runtime.sendMessage({ message: 'models' });
}

export async function getDecks() {
    return browser.runtime.sendMessage({ message: 'decks' });
}

export async function getFields() {
    return browser.runtime.sendMessage({ message: 'fields' });
}

export async function guiAddCards(fieldContent) {
    return browser.runtime.sendMessage({ message: 'guiAddCards', fieldContent });
}
