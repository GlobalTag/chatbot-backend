const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Mock dataset simulating information from the website
const dataset = [
  {
    title: "Key Cards RFID",
    content: "Le Key Cards RFID in PVC sono utilizzate per il controllo accessi in hotel, resort e spa. Possono essere personalizzate con loghi, codici QR e bande magnetiche. Compatibili con sistemi come Salto, Vingcard e Kaba."
  },
  {
    title: "Portachiavi RFID",
    content: "I portachiavi RFID in ABS sono un'alternativa alle card, disponibili in vari modelli e personalizzabili con incisioni laser, loghi e codici QR."
  },
  {
    title: "Bracciali RFID",
    content: "I bracciali RFID in silicone sono ideali per piscine, spa e parchi acquatici. Impermeabili e riutilizzabili, disponibili in vari colori."
  },
  {
    title: "Tag in Legno",
    content: "Tag RFID ecologici in legno FSC, personalizzabili in diverse forme e dimensioni. Ideali per strutture eco-friendly."
  }
];

// Endpoint per rispondere alle richieste del chatbot
app.post('/api/query', (req, res) => {
  const query = req.body.query.toLowerCase();
  const result = dataset.find(item =>
    item.title.toLowerCase().includes(query) || item.content.toLowerCase().includes(query)
  );
  if (result) {
    res.json({ response: result.content });
  } else {
    res.json({ response: "Mi dispiace, non ho trovato informazioni pertinenti. Prova a riformulare la tua domanda." });
  }
});

// Porta per il server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});
