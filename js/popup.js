import { checkAnkiConnectStatus, getCardModels, getDecks } from './api.js';

async function refreshDecks() {
    const decks = await getDecks();
    console.log(decks);
    await chrome.storage.sync.set({ decks });
    return decks;
}

async function refreshCardModels() {
    const cardModels = await getCardModels();
    await chrome.storage.sync.set({ cardModels });
    return cardModels;
}

/**
 * @param {boolean} ankiConnected
 */
function updateAnkiConnectionStatus(ankiConnected) {
    if (ankiConnected) {
        const ankiStatusDiv = document.getElementById('anki-connect-status');

        if (ankiStatusDiv) {
            ankiStatusDiv.textContent = 'Connected';
        }
    }

    return ankiConnected;
}

function generateDeckOptions(decks, selected) {
    const options = [];

    for (const deck of decks) {
        const option = document.createElement('option');
        option.setAttribute('value', deck);
        option.textContent = deck;

        if (selected === deck) {
            option.setAttribute('selected', '');
        }

        options.push(option);
    }

    return options;
}

function generateCardModelOptions(cardModels, selected) {
    const options = [];

    for (const model of Object.keys(cardModels)) {
        const option = document.createElement('option');
        option.setAttribute('value', model);
        option.textContent = model;

        if (selected === model) {
            option.setAttribute('selected', '');
        }

        options.push(option);
    }

    return options;
}

async function handleDeckSelect(e) {
    e.preventDefault();

    const deck = e.target.value;

    if (!deck) return;

    await chrome.storage.sync.set({ selectedDeck: e.target.value }).then(() => console.log('Selected deck:', e.target.value));
}

async function handleCardModelSelect(e) {
    e.preventDefault();

    const model = e.target.value;

    if (!model) return;

    await chrome.storage.sync.set({ selectedModel: e.target.value }).then(() => console.log('Selected model:', e.target.value));
}

async function getModels() {
    let { cardModels } = await chrome.storage.sync.get('cardModels');
    if (!cardModels) {
        cardModels = await refreshCardModels();
    }

    const { selectedModel } = await chrome.storage.sync.get('selectedModel');

    let { decks } = await chrome.storage.sync.get('decks');
    if (!decks) {
        decks = await refreshDecks();
    }

    const { selectedDeck } = await chrome.storage.sync.get('selectedDeck');

    return { cardModels, selectedModel, decks, selectedDeck };
}

const ankiConnected = await checkAnkiConnectStatus().then(updateAnkiConnectionStatus);

if (ankiConnected) {
    const { cardModels, selectedModel, decks, selectedDeck } = await getModels();

    const modelNodes = generateCardModelOptions(cardModels, selectedModel);

    const cardModelSelect = document.getElementById('model-select');
    for (const node of modelNodes) {
        cardModelSelect?.appendChild(node);
    }

    const deckNodes = generateDeckOptions(decks, selectedDeck);

    const deckSelect = document.getElementById('deck-select');
    for (const node of deckNodes) {
        deckSelect?.appendChild(node);
    }

    // DOM Event Listeners

    cardModelSelect?.addEventListener('change', handleCardModelSelect);
}

