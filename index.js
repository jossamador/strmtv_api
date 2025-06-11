const axios = require('axios');
const express = require('express');
const app = express();
const port = 3000;

const TMDB_API_KEY = '1087b47ed60a7c149fc4101df16584ed';

const items = require('./data/items');

// ✅ Búsqueda en API local
app.get('/api/search', (req, res) => {
  const { query } = req.query;
  const results = items.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase())
  );
  res.json(results);
});

// ✅ Filtrar por género
app.get('/api/genre/:genre', (req, res) => {
  const { genre } = req.params;
  const filtered = items.filter(item => item.genre.toLowerCase() === genre.toLowerCase());
  res.json(filtered);
});

// ✅ Obtener todos
app.get('/api/items', (req, res) => {
  res.json(items);
});

// ✅ Filtrar por tipo (movie / series)
app.get('/api/items/:type', (req, res) => {
  const { type } = req.params;
  const filtered = items.filter(item => item.type === type.toLowerCase());
  res.json(filtered);
});

// ✅ Búsqueda dinámica en TMDB — Películas + Series
app.get('/api/search_tmdb', async (req, res) => {
  const { query } = req.query;

  try {
    // 1️⃣ Buscar películas
    const movieResponse = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: TMDB_API_KEY,
        query: query
      }
    });

    // 2️⃣ Buscar series
    const tvResponse = await axios.get('https://api.themoviedb.org/3/search/tv', {
      params: {
        api_key: TMDB_API_KEY,
        query: query
      }
    });

    // Combinar resultados
    const movieResults = movieResponse.data.results.map(result => ({
      title: result.title || 'Unknown',
      poster: result.poster_path
        ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
        : null,
      media_type: 'movie',
      overview: result.overview,
      release_date: result.release_date
    }));

    const tvResults = tvResponse.data.results.map(result => ({
      title: result.name || 'Unknown',
      poster: result.poster_path
        ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
        : null,
      media_type: 'tv',
      overview: result.overview,
      release_date: result.first_air_date
    }));

    // Juntar y enviar
    const combinedResults = [...movieResults, ...tvResults];

    res.json({ results: combinedResults });

  } catch (error) {
    console.error('Error al consultar TMDB:', error.message);
    res.status(500).json({ error: 'Error al consultar TMDB' });
  }
});

// Iniciar servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});