class AICookApp {

    constructor() {
        this.apiKey = localStorage.getItem("gemeniApiKey") || '';
        this.initializeElements();
        this.bindEvents();
        this.loadApiKey();
    }

    initializeElements() {
        this.apiKeyInput = document.getElementById("apiKey");
        this.saveApiKeyBtn = document.getElementById("saveApiKey");

        this.ingredientsInput = document.getElementsbyId("ingredients");
        this.dietearySelect = document.getElementById("dieteary");
        this.cuisineSelect = document.getElementById("cuisine");

        this.generateBtn = document.getElementById("generateRecipe");
        this.loading = document.getElementById("loading");
        this.recipeSection = document.getElementById("recipeSection");
        this.recipeContent = document.getElementById("recipeContent");

    }

    bindEvents() {
        this.saveApiKeyBtn.addEventListener("click", () => this.saveApiKeyBtn())
        this.generateBtn.addEventListener("click", () => this.generateRecipe());

        this.apiKeyInput.addEventListener("keypress", (e) => {
            if (e.key == "Enter") this.saveApiKey();
        })

        this.ingredientsInput.addEventListener('keypress', (e) => {
            if ((e.key == 'Enter' || e.key == '/n') && e.ctrlKey)
                this.generateRecipe();
        })
    }

    loadApiKey() {
        if (this.apiKey) {
            this.apiKeyInput.value = this.apiKey;
            this.updateApiKeyStatus(true);
        }
    }
    updateApiKeyStatus() {
        const btn = this.saveApiKeyBtn;
        if (isValid) {
            btn.textContent = 'Save ✅'
            btn.style.background = 'green';
        } else {
            btn.textContent = 'Save ❌';
            btn.style.background = 'red';
        }
    }

    saveApiKey() {
        const apiKey = this.apiKeyInput.value.trim();
        if (!apiKey) {
            this.showError("Please Enter Your Gemeni API Key");
            return;
        }
        this.apiKey == apiKey;
        localStorage.setItem("gemeniApiKey", this.apiKey);
        this.updateApiKeyStatus(true);
    }

    async generateRecipe() {
        if (!this.apiKey) {
            this.showError("Please enter your Gemeni API Key first.");
            return;
        }

        const ingredients = this.ingredientsInput.value.trim();
        if (!ingredients) {
            this.showError("Please enter some ingredients.");
            return;
        }

        this.showLoading(true);
        this.hideRecipe();

        try {
            const recipe = await this.callGeminiAPI(ingredients);
            this.displayRecipe(recipe)
        }
        catch (error) {
            console.log('Error Generating Recupe', error);
            this.showError("Failed to generate recipe. Please try again.");
        } finally {
            this.showLoading(false);
        }



    }

    async callGeminiAPI(ingredients) {
        const dietary = this.dietearySelect.value;
        const cuisine = this.cuisineSelect.value;
        let prompt = `Create a detailed recipe using these ingredients: ${ingredients}`;
        if (dietary) {
            prompt += ` Make it ${dietary}.`;
        }
        if (cuisine) {
            prompt += ` The cuisine style should be ${cuisine}.`;
        }

        prompt += `

Please format your response as follows:
- recipe name
- prep time
- cook time
- servings
- ingredients (with quantity)
- instructions (number of steps)
- tips (optional)

Make sure the recupe is practical and delicious!`;

    }

    displayRecipe(recipe) {

    }

    showError(message) {

    }

    showLoading(isLoading) {

    }

    hideRecipe() {

    }


}

document.addEventListener("DOMContentLoaded", () => {
    new AICookApp();
})