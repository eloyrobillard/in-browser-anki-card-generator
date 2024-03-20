import { checkAnkiConnectStatus, getCardModels } from './api.js';

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

    chrome.storage.sync.set({ selectedModel: e.currentTarget.value }).then(() => console.log('Set selected model', e.currentTarget.value));
}

const cardModels = chrome.storage.sync.get('cardModels');
await cardModels.then(async _ms => {
    const cardModelSelect = document.getElementById('model-select');
    cardModelSelect?.addEventListener('change', setCardModel);

    await getCardModels(async data => {
        chrome.storage.sync.set({ cardModels: data });

        const selected = await chrome.storage.sync.get('selectedModel');
        console.log(selected);
        const options = generateCardModelOptions(data, selected);

        for (const option of options) {
            cardModelSelect?.appendChild(option);
        }
    });
});

await checkAnkiConnectStatus(res => {
    if (res && typeof res === 'object' && 'result' in res) {
        updateAnkiConnectionStatus(!!res.result);
    }
});

