import Groq from "groq-sdk";

// Load API key from environment variables
const groqApiKey = process.env.REACT_APP_GROQ_API_KEY;

// Handle missing API key
if (!groqApiKey) {
  console.error(
    "❌ GROQ API Key is missing! Check your .env file and restart the app."
  );
}

// Initialize Groq client only if API key exists
const openai = groqApiKey
  ? new Groq({ apiKey: groqApiKey, dangerouslyAllowBrowser: true })
  : null;

export default openai;
