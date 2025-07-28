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

        this.ingredientsInput = document.getElementById("ingredients");
        this.dietearySelect = document.getElementById("dietary");
        this.cuisineSelect = document.getElementById("cuisine");

        this.generateBtn = document.getElementById("generateRecipe");
        this.loading = document.getElementById("loading");
        this.recipeSection = document.getElementById("recipeSection");
        this.recipeContent = document.getElementById("recipeContent");

    }

    bindEvents() {
        this.saveApiKeyBtn.addEventListener("click", () => this.saveApiKey())
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
    updateApiKeyStatus(isValid) {
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
        this.apiKey = apiKey;
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
            console.log('Error Generating Recipe', error);
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

        const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': `application/json`,
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 2048,
                }
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;

    }

    displayRecipe(recipe) {
        let formattedRecipe = this.formatRecipe(recipe)
        this.recipeContent.innerHTML = formattedRecipe;
        this.showRecipe();
    }

    formatRecipe(recipe) {
        //multiline
        recipe = recipe.replace(/(^| ) +/gm, "$1")
        recipe = recipe.replace(/^- */gm, "")
        recipe = recipe.replace(/\*\*(.+?)\*\**/gm, "<strong>$1</strong>")
        //not multiline
        recipe = recipe.replace(/^(.+)/g, "<h3 class='recipe-title'>$1</h3>")
        recipe = recipe.replace(/^\*/gm, "•")
        recipe = recipe.replace(/^(.+)/gm, "<p>$1</p>")





        return recipe;
    }


    showError(message) {
        alert(message);
    }

    showLoading(isLoading) {
        if (isLoading) {
            this.loading.classList.add('show');
            this.generateBtn.disabled = true;
            this.generateBtn.textContent = 'Generating...';
        }
        else {
            this.loading.classList.remove('show');
            this.generateBtn.disabled = false;
            this.generateBtn.textContent = 'Generate Recipe';
        }
    }

    showRecipe() {
        this.recipeSection.classList.add('show');
        this.recipeSection.scrollIntoView({ behavior: 'smooth' });
    }
    hideRecipe() {
        this.recipeSection.classList.remove('show');
    }


}

document.addEventListener("DOMContentLoaded", () => {
    new AICookApp();
})