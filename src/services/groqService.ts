import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY || "",
    dangerouslyAllowBrowser: true // For client-side demo purposes
});

export interface EmotionalState {
    emotion: string;
    note?: string;
    timestamp: number;
}

export const getDailyAdvice = async (history: EmotionalState[]) => {
    const recentHistory = history.slice(-5).map(h => `${h.emotion} (${new Date(h.timestamp).toLocaleDateString()})`).join(", ");

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Eres Margareth, una mascota guía emocional para niños de 3 a 6 años. Genera un consejo corto, tierno y positivo para hoy (máximo 12 palabras). Usa un lenguaje muy sencillo. Responde solo con el consejo."
                },
                {
                    role: "user",
                    content: `El historial reciente del niño es: ${recentHistory || "Primer día"}.`
                }
            ],
            model: "llama-3.3-70b-versatile",
        });
        return chatCompletion.choices[0]?.message?.content || "¡Hoy es un gran día para brillar!";
    } catch (error) {
        console.error("Error Groq Daily Advice:", error);
        return "¡Hoy es un gran día para ser feliz!";
    }
};

export const analyzeEmotion = async (emotion: string, drawingData?: string) => {
    try {
        if (drawingData) {
            const base64Image = drawingData.split(",")[1];
            const response = await groq.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: `El niño se siente ${emotion} y ha hecho este dibujo. Como Margareth, dale un mensaje de apoyo tierno y corto (máximo 15 palabras).` },
                            {
                                type: "image_url",
                                image_url: { url: `data:image/png;base64,${base64Image}` }
                            }
                        ]
                    }
                ],
                model: "llama-3.2-11b-vision-preview",
            });
            return response.choices[0]?.message?.content || "¡Te quiero mucho!";
        }

        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Eres Margareth, una mascota guía emocional. El niño se siente una emoción específica. Dale un mensaje de apoyo tierno y corto (máximo 15 palabras)."
                },
                {
                    role: "user",
                    content: `Me siento ${emotion}.`
                }
            ],
            model: "llama-3.3-70b-versatile",
        });
        return response.choices[0]?.message?.content || "¡Te quiero mucho!";
    } catch (error) {
        console.error("Error Groq Analyze Emotion:", error);
        return "¡Qué bueno que compartas cómo te sientes!";
    }
};

export const generateConflictScenario = async () => {
    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Genera una situación de conflicto social para niños de 4-6 años. Varía los temas: compartir, esperar turno, desacuerdos al jugar, inclusión (invitar a alguien a jugar), o sentimientos heridos. Usa un lenguaje muy sencillo y tierno. Retorna un JSON estrictamente válido con: situation (string corto), question (string), y options (array de 3 { id, text, type } donde type es 'positive', 'negative' o 'neutral')."
                }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });
        return JSON.parse(response.choices[0]?.message?.content || "{}");
    } catch (error) {
        console.error("Error Groq Conflict:", error);
        const backups = [
            {
                situation: "Tu amigo tiene un juguete que tú también quieres usar ahora mismo.",
                question: "¿Qué podemos hacer?",
                options: [
                    { id: "1", text: "Esperar mi turno y jugar con otra cosa mientras", type: "positive" },
                    { id: "2", text: "Quitarle el juguete rápido", type: "negative" },
                    { id: "3", text: "Preguntar si podemos jugar los dos juntos", type: "positive" }
                ]
            },
            {
                situation: "Ves a una niña sentada solita mientras todos los demás juegan.",
                question: "¿Qué sería lo más amable?",
                options: [
                    { id: "1", text: "Seguir jugando como si nada", type: "neutral" },
                    { id: "2", text: "Invitarla a jugar con nosotros", type: "positive" },
                    { id: "3", text: "Decirle que no puede jugar", type: "negative" }
                ]
            },
            {
                situation: "Estás haciendo una torre y alguien la tumba sin querer.",
                question: "¿Cómo reaccionamos?",
                options: [
                    { id: "1", text: "Enojarme y gritar muy fuerte", type: "negative" },
                    { id: "2", text: "Decir 'no pasa nada' y armarla de nuevo", type: "positive" },
                    { id: "3", text: "Pedirle que me ayude a reconstruirla", type: "positive" }
                ]
            }
        ];
        return backups[Math.floor(Math.random() * backups.length)];
    }
};

export const evaluateConflictChoice = async (situation: string, choice: string) => {
    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Eres una maestra tierna. Evalúa la opción de un niño de 5 años en una situación de conflicto. Dale un feedback muy corto (máximo 20 palabras), positivo y educativo."
                },
                {
                    role: "user",
                    content: `Situación: "${situation}". Elección: "${choice}".`
                }
            ],
            model: "llama-3.3-70b-versatile",
        });
        return response.choices[0]?.message?.content || "¡Gracias por compartir cómo te sientes!";
    } catch (error) {
        console.error("Error Groq Evaluate Choice:", error);
        return "¡Gracias por compartir cómo te sientes!";
    }
};

export const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 0.9;
        utterance.pitch = 1.2; // Voice slightly higher for a child-friendly tone

        // Attempt to find a female/friendly voice
        const voices = window.speechSynthesis.getVoices();
        const spanishVoice = voices.find(v => v.lang.startsWith('es') && v.name.toLowerCase().includes('female'))
            || voices.find(v => v.lang.startsWith('es'));

        if (spanishVoice) utterance.voice = spanishVoice;

        window.speechSynthesis.speak(utterance);
    } else {
        console.error("Speech synthesis not supported");
    }
};
