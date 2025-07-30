import Model from './model.js';
import View from './view.js';

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = Model.getLanguage().lang;

let aiRequestInProgress = false;

async function handleVoiceInput(event) {
    const userText = event.results[0][0].transcript;
    const updateStory = Model.appendLine("Player", userText);
    View.updateStory(updateStory);

    View.toggleLoading(true);
    aiRequestInProgress = true;
    const aiRespo9nse = await Model.generateStory(updateStory + "\nNarrator:");
    aiRequestInProgress = false;
    const finalStory = Model.appendLine("Narrator", aiResponse);
    view.updateStory(finalStory);
    view.speakText(aiResponse, Model.getLanguage().lang);
}

function handleLanguageChange() {
    const selectOption = View.getLanguageSelect().selectOptions[0];
    const newLang = selectOption.value;
    const newLangName = selectOption.dataset.name;
    Model.setLanguage(newLang, newLangName);
    recognition.lang = newLang;
}

function handleStopSpeaking() {
    View.stopSpeaking();
    if (aiRequestInProgress) {
        View.toggleLoading(false);
        aiRequestInProgress = false;
    }

    const resetStory = Model.resetStory();
    View.updateStory(resetStory);

    setTimeout(() => {
        View.speakText("Story reset. You can start a new story now.",
            Model.getLanguage().lang)
    }, 500);
}

function handlePauseResume(e) {
    const newState = View.pauseOrResumeSpeaking();
    e.target.textContent = newState === "Pause" ? "Pause ⏸️" : "Resume ▶️";
}

function init() {
    window.speechSynthesis.onvoiceschanged = () => { };
    const initialStoryContent = View.getInitialStoryContent();
    Model.initalizeStory(initialStoryContent);
    View.updateStory(Model.getStory());

    setTimeout(() => {
        View.speakText("Story Reset! Help me build a story! Start with a sentence and I will continue it.",
            Model.getLanguage().lang);

    }, 500);

    View.getSpeakBtn().onclick = () => {
        try {
            recognition.start();
        }
        catch (error) {
            console.error("Speech Recognition Error:", error);
        }
    };
    recognition.onresult = handleVoiceInput;
    recognition.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        View.toggleLoading(false);
        aiRequestInProgress = false;
    };

    View.getLanguageSelect().addEventListener("change", handleLanguageChange);

    View.getStopSpeakBtn().onclick = handleStopSpeaking;
    View.getPauseSpeakBtn().onclick = handlePauseResume;

}
init()