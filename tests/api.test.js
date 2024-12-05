const request = require('supertest');
const { app } = require('../index.js');
const { getAllGames, getGameById } = require('../controllers');

const http = require('http');
const { describe, beforeEach } = require('node:test');

jest.mock('../controllers', () => ({
  ...jest.requireActual('../controllers'),
  getAllGames: jest.fn(),
  getGameById: jest.fn(),
}));

let server;
beforeAll(async () => {
  server = http.createServer(app);
  server.listen(3001);
});

afterAll(async () => {
  server.close();
});

describe('controller functions testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get All Games', () => {
    let mockGames = [
      {
        gameId: 1,
        title: 'The Legend of Zelda: Breath of the Wild',
        genre: 'Adventure',
        platform: 'Nintendo Switch',
      },
      {
        gameId: 2,
        title: 'Red Dead Redemption 2',
        genre: 'Action',
        platform: 'PlayStation 4',
      },
      {
        gameId: 3,
        title: 'The Witcher 3: Wild Hunt',
        genre: 'RPG',
        platform: 'PC',
      },
    ];

    getAllGames.mockReturnValue(mockGames);
    let result = getAllGames();
    expect(result.length).toBe(3);
    expect(result).toEqual(mockGames);
  });

  it('should get a game by its id', () => {
    let mockGame = {
      gameId: 3,
      title: 'The Witcher 3: Wild Hunt',
      genre: 'RPG',
      platform: 'PC',
    };

    getGameById.mockReturnValue(mockGame);
    let result = getGameById(2);
    expect(result).toEqual(mockGame);
  });
});

describe('API endpoint testing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('/games should retrive all games', async () => {
    let res = await request(server).get('/games');
    expect(res.status).toBe(200);
    expect(res.body.games.length).toBe(3);
    expect(res.body).toEqual({
      games: [
        {
          gameId: 1,
          title: 'The Legend of Zelda: Breath of the Wild',
          genre: 'Adventure',
          platform: 'Nintendo Switch',
        },
        {
          gameId: 2,
          title: 'Red Dead Redemption 2',
          genre: 'Action',
          platform: 'PlayStation 4',
        },
        {
          gameId: 3,
          title: 'The Witcher 3: Wild Hunt',
          genre: 'RPG',
          platform: 'PC',
        },
      ],
    });
  });

  it('/games/details/:id should return game by id', async () => {
    getGameById.mockReturnValue({
      gameId: 1,
      title: 'The Legend of Zelda: Breath of the Wild',
      genre: 'Adventure',
      platform: 'Nintendo Switch',
    });
    let res = await request(server).get('/games/details/2');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      game: {
        gameId: 1,
        title: 'The Legend of Zelda: Breath of the Wild',
        genre: 'Adventure',
        platform: 'Nintendo Switch',
      },
    });
  });
});
