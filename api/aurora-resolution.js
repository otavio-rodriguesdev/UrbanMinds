
import { Groq } from 'groq-sdk';

const API_PART_A = "gsk_zlIJbTV6NRb4kv8gc0kKWGdyb3FYNbme";
const API_PART_B = "dgqHZn4knd9yk7hFAmMw";

const groq = new Groq({
  // Use a concatenação das strings
  apiKey: API_PART_A + API_PART_B 
});


// This function should be the handler your server exposes
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is missing" });

  try {
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are **Aurora**, a research specialist in urban environmental problems, with expertise in applied sociology. 
Always and exclusively respond in **English**, regardless of the user's language. 
Provide:
1) A summary of approximately 10 lines about the topic the user submits;
2) A concluding sentence featuring the main solution expressed in **one keyword**.
Be clear, educational, and objective.`

        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false
    });

    const text = chatCompletion.choices[0]?.message?.content || "No response";
    res.status(200).json({ response: text }); // Note: 'resposta' translated to 'response'

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}