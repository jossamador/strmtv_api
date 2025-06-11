const axios = require('axios');

const TMDB_API_KEY = '1087b47ed60a7c149fc4101df16584ed'; // pon aquí tu API key

const titles = [
  "Inception",
  "Breaking Bad",
  "The Dark Knight",
  "Stranger Things",
  "Interstellar",
  "The Crown",
  "The Matrix",
  "Game of Thrones",
  "The Shawshank Redemption",
  "Donnie Darko",
  "The Office",
  "Pulp Fiction",
  "The Mandalorian",
  "The Godfather",
  "The Godfather: Part II",
  "The Godfather: Part III",
  "Black Mirror",
  "The Witcher",
  "Avatar",
  "The Simpsons"
];

async function fetchPoster(title) {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/search/multi', {
      params: {
        api_key: TMDB_API_KEY,
        query: title
      }
    });

    const result = response.data.results[0]; // primer resultado

    if (result && result.poster_path) {
      console.log(`${title}: https://image.tmdb.org/t/p/w500${result.poster_path}`);
    } else {
      console.log(`${title}: No se encontró poster`);
    }
  } catch (error) {
    console.error(`Error al buscar "${title}":`, error.message);
  }
}

async function main() {
  for (const title of titles) {
    await fetchPoster(title);
  }
}

main();