const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());
app.use(express.json());

// Funzione per fare scraping delle informazioni dal sito
async function scrapeWebsite(query) {
  try {
    const { data } = await axios.get('https://www.global-tag.com/rfid-for-hotellery/');
    const $ = cheerio.load(data);

    // Cerca contenuti nel sito
    const results = [];
    $('p').each((index, element) => {
      const text = $(element).text();
      if (text.toLowerCase().includes(query.toLowerCase())) {
        results.push(text);
      }
    });

    return results.length
      ? results.join('\n')
      : 'Non ho trovato informazioni pertinenti sul sito.';
  } catch (error) {
    console.error('Errore durante lo scraping:', error);
    return 'Errore durante il recupero delle informazioni dal sito.';
  }
}

// Endpoint per gestire le richieste del chatbot
app.post('/api/query', async (req, res) => {
  const { query } = req.body;
  console.log(`Query ricevuta: ${query}`);
  const response = await scrapeWebsite(query);
  res.json({ response });
});

// Porta del server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
