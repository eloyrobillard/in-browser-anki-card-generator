import { checkAnkiConnectStatus, getCardModels, getDecks, getFields } from './api.js';

async function refreshDecks() {
    const decks = await getDecks();
    // deckNames object too large to store in storage.sync
    // await chrome.storage.sync.set({ decks });
    return decks;
}

async function refreshCardModels() {
    const cardModels = await getCardModels();
    await chrome.storage.sync.set({ cardModels });
    return cardModels;
}

/**
 * @return {Promise<string[]>) fields
 */
async function refreshFields() {
    const fields = await getFields();
    await chrome.storage.sync.set({ fields });
    return fields;
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

/**
 * @param {string[]} decks
 * @param {string} selected
 */
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

/**
 * @param {{ [key: string]: any }} cardModels
 * @param {string} selected
 */
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

    await chrome.storage.sync.set({ selectedDeck: e.target.value });
    console.log('Selected deck:', e.target.value);
}

async function handleModelSelect(e) {
    e.preventDefault();

    const model = e.target.value;

    if (!model) return;

    await chrome.storage.sync.set({ selectedModel: e.target.value });
    console.log('Selected model:', e.target.value);

    let fieldSelect = document.getElementById('field-select');
    if (fieldSelect && fieldSelect.parentNode) {
        fieldSelect.parentNode.removeChild(fieldSelect);
    }

    const fields = await refreshFields();
    await chrome.storage.sync.set({ selectedField: fields[0] });
    fieldSelect = createFieldSelect(fields, fields[0]);

    document.getElementById('model-select')?.after(fieldSelect);
}

async function getModels() {
    let { cardModels } = await chrome.storage.sync.get('cardModels');
    if (!cardModels) {
        cardModels = await refreshCardModels();
    }

    const { selectedModel } = await chrome.storage.sync.get('selectedModel');

    const decks = await refreshDecks();
    const { selectedDeck } = await chrome.storage.sync.get('selectedDeck');

    return { cardModels, selectedModel, decks, selectedDeck };
}

function handleFieldSelect(e) {
    e.preventDefault();

    chrome.storage.sync.set({ selectedField: e.target.value });
}

/**
 * @param {string[]} fields
 * @param {string} selectedField
 */
function createFieldSelect(fields, selectedField) {
    const fieldSelect = document.createElement('select');
    fieldSelect.id = 'field-select';

    for (const field of fields) {
        const option = document.createElement('option');
        option.value = field;
        option.textContent = field;
        if (field === selectedField) option.setAttribute('selected', '');

        fieldSelect.appendChild(option);
    }

    fieldSelect.addEventListener('change', handleFieldSelect);
    return fieldSelect;
}

const ankiConnected = await checkAnkiConnectStatus();
updateAnkiConnectionStatus(ankiConnected);

if (ankiConnected) {
    const { cardModels, selectedModel, decks, selectedDeck } = await getModels();

    const modelSelect = document.getElementById('model-select'); // || createModelSelect();
    if (modelSelect) {
        const modelNodes = generateCardModelOptions(cardModels, selectedModel);

        for (const node of modelNodes) {
            modelSelect.appendChild(node);
        }

        if (selectedModel) {
            const fields = await refreshFields();

            let { selectedField } = await chrome.storage.sync.get('selectedField');
            if (!selectedField || !fields.includes(selectedField)) {
                selectedField = fields[0];
                await chrome.storage.sync.set({ selectedField });
            }

            const fieldSelect = createFieldSelect(fields, selectedField);
            modelSelect.after(fieldSelect);
        }
    }

    const deckSelect = document.getElementById('deck-select'); // || createDeckSelect();
    if (deckSelect) {
        const deckNodes = generateDeckOptions(decks, selectedDeck);

        for (const node of deckNodes) {
            deckSelect.appendChild(node);
        }
    }

    // DOM Event Listeners

    modelSelect?.addEventListener('change', handleModelSelect);
    deckSelect?.addEventListener('change', handleDeckSelect);
}

