import { checkAnkiConnectStatus, getCardModels } from './api.js';

async function refreshCardModels() {
    const data = await getCardModels();
    await chrome.storage.sync.set({ cardModels: data });
    return data;
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
}

function generateCardModelOptions(data, selected) {
    const { result } = data;
    const options = [];

    if (result) {
        for (const model of Object.keys(result)) {
            const option = document.createElement('option');
            option.setAttribute('value', model);
            option.textContent = model;

            if (selected === model) {
                option.setAttribute('selected', '');
            }

            options.push(option);
        }
    }

    return options;
}

function setCardModel(e) {
    e.preventDefault();

    chrome.storage.sync.set({ selectedModel: e.target.value }).then(() => console.log('Set selected model', e.target.value));
}

// TODO: remove need for destructuring
let { cardModels } = await chrome.storage.sync.get('cardModels');
const cardModelSelect = document.getElementById('model-select');

if (!cardModels) {
    cardModels = await refreshCardModels();
}

// TODO: remove need for destructuring
const { selectedModel } = await chrome.storage.sync.get('selectedModel');
console.log('Selected model', selectedModel);

// TODO: implement
if (!selectedModel) { }

const options = generateCardModelOptions(cardModels, selectedModel);

for (const option of options) {
    cardModelSelect?.appendChild(option);
}

await checkAnkiConnectStatus().then(res => {
    if (res && typeof res === 'object' && 'result' in res) {
        updateAnkiConnectionStatus(!!res.result);
    }
});

// DOM Event Listeners

cardModelSelect?.addEventListener('change', setCardModel);

