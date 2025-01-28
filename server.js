const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());
app.use(express.json());

// Funzione per fare scraping di tutto il contenuto del sito
async function scrapeWebsite(query) {
  try {
    const url = 'https://www.global-tag.com/rfid-for-hotellery/';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Cerca in tutto il contenuto del DOM
    const bodyText = $('body').text().toLowerCase(); // Estrae tutto il testo del corpo
    const results = [];

    // Suddividi il testo in paragrafi o righe
    const lines = bodyText.split('\n').map(line => line.trim()).filter(line => line);

    // Cerca la query all'interno di ogni riga
    lines.forEach(line => {
      if (line.includes(query.toLowerCase())) {
        results.push(line);
      }
    });

    return results.length
      ? results.join('\n\n') // Unisce i risultati trovati
      : 'Non ho trovato informazioni pertinenti sul sito.';
  } catch (error) {
    console.error('Errore durante lo scraping:', error);
    return 'Errore durante il recupero delle informazioni dal sito.';
  }
}

// Endpoint per rispondere alle richieste del chatbot
app.post('/api/query', async (req, res) => {
  const { query } = req.body;
  console.log(Query ricevuta: ${query});

  const response = await scrapeWebsite(query);
  res.json({ response });
});

// Porta del server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(Server in ascolto sulla porta ${PORT});
});
