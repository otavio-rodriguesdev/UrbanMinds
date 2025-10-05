// aurora.js
// Chamado APENAS pelo index.html
// Lógica de comunicação com a API Serverless

document.addEventListener('DOMContentLoaded', function () {
    
    // O endpoint da sua função serverless, mapeado para api/aurora-resolution.js
    const API_ENDPOINT = '/api/aurora-resolution'; 

    async function runAuroraAnalysis(event) {
        event.preventDefault(); // Impede o envio de formulário HTML padrão

        const locationInput = document.getElementById('location');
        const issueInput = document.getElementById('issue');
        const resolutionOutput = document.getElementById('resolution');
        const sendButton = document.getElementById('send-analysis-button');
        
        if (!locationInput || !issueInput || !resolutionOutput) {
            console.error("ERRO: Aurora section elements not found (Check the index.html).");
            return;
        }

        const locationValue = locationInput.value.trim();
        const issueValue = issueInput.value.trim();
        
        if (!locationValue || !issueValue) {
            resolutionOutput.value = "Please fill in the city/location and the issue for analysis.";
            return;
        }

        // 1. Estado de Carregamento
        const originalButtonText = sendButton.textContent;
        sendButton.disabled = true;
        sendButton.textContent = 'Analyzing...';
        resolutionOutput.value = `Aurora is analyzing the issue of'${locationValue}'... Please wait for the AI's response.`;

        // Constrói o Prompt completo para enviar à Groq
        const prompt = `Location:${locationValue}. Problem:${issueValue}`;

        try {
            // 2. Faz a chamada assíncrona (fetch) para a Serverless Function
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt }),
            });

            if (!response.ok) {
                // Trata erros de HTTP
                const errorData = await response.json().catch(() => ({ error: 'Network error or unknown server.' }));
                throw new Error(errorData.error || `Network or server error: Code ${response.status}`);
            }

            const data = await response.json();
            
            // 3. Exibe o resultado da IA
            // O campo 'response' vem do seu aurora-resolution.js
            const finalResolution = data.response || "Aurora did not return a valid analysis.";
            resolutionOutput.value = finalResolution;

        } catch (error) {
            console.error("Error in Dawn Analysis:", error);
            resolutionOutput.value = `ERROR: Unable to obtain Aurora's analysis. Please try again. Details: ${error.message}`;
        } finally {
            // 4. Restaura o estado do botão
            sendButton.disabled = false;
            sendButton.textContent = originalButtonText;
        }
    }

    // Conecta o botão "SEND!"
    const sendButton = document.getElementById('send-analysis-button');
    if (sendButton) {
        sendButton.addEventListener('click', runAuroraAnalysis);
    } else {
        console.warn("WARNING: The 'SEND!' button of Aurora was not found.");
    }
});