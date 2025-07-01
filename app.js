const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { images: null });
});

app.post('/search', async (req, res) => {
  const astro = req.body.astro;
  const apiKey = process.env.API_KEY;
  const count = 20;

  try {
    const response = await axios.get(`https://api.nasa.gov/planetary/apod`, {
      params: {
        api_key: apiKey,
        count: count
      }
    });

    const filteredImages = response.data.filter(item => 
      !item.copyright &&
      item.media_type === "image" &&
      (item.title.toLowerCase().includes(astro.toLowerCase()) ||
       item.explanation.toLowerCase().includes(astro.toLowerCase()))
    );

    res.render('index', { images: filteredImages, astro });
  } catch (err) {
    console.error(err);
    res.render('index', { images: null, error: "Erro ao buscar imagens." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
