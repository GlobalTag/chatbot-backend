const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// Configura OpenAI
const configuration = new Configuration({
  apiKey: 'sk-proj-MkeUnsff0pYsi_fbp_9V11lesSSMdLb7X0-98-2sXtacIzCrASCHAppGUfz1g5mBCKkiGSqMxyT3BlbkFJODl-CZrFXN4GTR5bvcge3jj9B0shNBvSZmZfxxPOF9VEKpYOUr4Rf5UKPepAh40UIze-nI0YAA', // Sostituisci con la tua chiave API OpenAI
});
const openai = new OpenAIApi(configuration);

// Funzione per fare scraping del sito
async function scrapeWebsite(query) {
  try {
    const url = 'https://www.global-tag.com/rfid-for-hotellery/';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const bodyText = $('body').text().toLowerCase();
    const results = [];
    const lines = bodyText.split('\n').map(line => line.trim()).filter(line => line);

    lines.forEach(line => {
      if (line.includes(query.toLowerCase())) {
        results.push(line);
      }
    });

    return results.length
      ? results.join('\n\n')
      : 'Non ho trovato informazioni pertinenti sul sito.';
  } catch (error) {
    console.error('Errore durante lo scraping:', error);
    return 'Errore durante il recupero delle informazioni dal sito.';
  }
}

// Funzione per ottenere risposte da GPT
async function getGPTResponse(query, context) {
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo', // Puoi usare anche "gpt-4" se disponibile
      messages: [
        { role: 'system', content: 'Sei un assistente esperto in RFID/NFC e dispositivi per l’hotellerie.' },
        { role: 'user', content: `Domanda: ${query}\nContesto: ${context}` },
      ],
    });
    return completion.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Errore OpenAI:', error);
    return 'Non sono riuscito a elaborare una risposta. Riprova più tardi.';
  }
}

// Endpoint per gestire richieste del chatbot
app.post('/api/query', async (req, res) => {
  const { query } = req.body;
  console.log(`Query ricevuta: ${query}`);

  // 1. Recupera dati dal sito
  const scrapedData = await scrapeWebsite(query);

  // 2. Ottieni la risposta da GPT
  const gptResponse = await getGPTResponse(query, scrapedData);

  // 3. Combina le risposte e invia
  res.json({ response: gptResponse });
});

// Porta del server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
