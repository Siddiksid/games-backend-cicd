const express = require('express');
const { resolve } = require('path');
const { getAllGames, getGameById } = require('./controllers/index.js');
const cors = require('cors');
const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json());
app.use(cors());

app.get('/games', (req, res) => {
  let games = getAllGames();
  res.json({ games });
});

app.get('/games/details/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let game = getGameById(id);
  res.json({ game });
});
module.exports = { app };
