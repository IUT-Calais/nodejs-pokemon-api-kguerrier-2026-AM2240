import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';

describe('PokemonCard API', () => {
  describe('GET /pokemons-cards', () => {
    it('should fetch all PokemonCards', async () => {
      const mockPokemonCards = [
        {
          id: 1,
          name: 'Pikachu',
          pokedexID: 25,
          lifePoints: 35,
          size: 0.4,
          weight: 6.0,
          imageUrl: 'https://example.com/pikachu.png',
          typeId: 1,
          type: { id: 1, name: 'Electric' },
        },
      ];

      prismaMock.pokemonCard.findMany.mockResolvedValue(mockPokemonCards);

      const response = await request(app).get('/pokemons-cards');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /pokemons-cards/:pokemonCardId', () => {
    it('should fetch a PokemonCard by ID', async () => {
      const mockPokemonCard = {
        id: 1,
        name: 'Pikachu',
        pokedexID: 25,
        lifePoints: 35,
        size: 0.4,
        weight: 6.0,
        imageUrl: 'https://example.com/pikachu.png',
        typeId: 1,
        type: { id: 1, name: 'Electric' },
      };

      prismaMock.pokemonCard.findUnique.mockResolvedValue(mockPokemonCard);

      const response = await request(app).get('/pokemons-cards/1');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.name).toBeDefined();
      expect(response.body.pokedexID).toBeDefined();
      expect(response.body.lifePoints).toBeDefined();
      expect(response.body.typeId).toBeDefined();
    });

    it('should return 404 if PokemonCard is not found', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/pokemons-cards/99999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /pokemon-cards', () => {
    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .post('/pokemon-cards')
        .send({
          name: 'TestPokemon',
          pokedexId: 999,
          type: 1,
          lifePoints: 100,
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Unauthorized');
    });

    it('should create a PokemonCard with valid data and token', async () => {
      const newPokemonCard = {
        name: 'Bulbasaur',
        pokedexId: 1,
        type: 3,
        lifePoints: 45,
        size: 0.7,
        weight: 6.9,
        imageUrl: 'https://example.com/bulbasaur.png',
      };

      const createdPokemonCard = {
        id: 3,
        name: 'Bulbasaur',
        pokedexID: 1,
        lifePoints: 45,
        size: 0.7,
        weight: 6.9,
        imageUrl: 'https://example.com/bulbasaur.png',
        typeId: 3,
        type: { id: 3, name: 'Grass' },
      };

      prismaMock.type.findUnique.mockResolvedValue({ id: 3, name: 'Grass' });
      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(null);
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
      prismaMock.pokemonCard.create.mockResolvedValue(createdPokemonCard);

      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer mockedToken')
        .send(newPokemonCard);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Bulbasaur');
      expect(response.body.pokedexID).toBe(1);
      expect(response.body.lifePoints).toBe(45);
    });

    it('should create a PokemonCard without optional fields', async () => {
      const newPokemonCard = {
        name: 'Bulbasaur',
        pokedexId: 1,
        type: 3,
        lifePoints: 45,
      };

      const createdPokemonCard = {
        id: 3,
        name: 'Bulbasaur',
        pokedexID: 1,
        lifePoints: 45,
        size: null,
        weight: null,
        imageUrl: null,
        typeId: 3,
        type: { id: 3, name: 'Grass' },
      };

      prismaMock.type.findUnique.mockResolvedValue({ id: 3, name: 'Grass' });
      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(null);
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
      prismaMock.pokemonCard.create.mockResolvedValue(createdPokemonCard);

      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer mockedToken')
        .send(newPokemonCard);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Bulbasaur');
      expect(response.body.size).toBeNull();
      expect(response.body.weight).toBeNull();
      expect(response.body.imageUrl).toBeNull();
    });

    it('should create a PokemonCard with all fields', async () => {
      const newPokemonCard = {
        name: 'Charizard',
        pokedexId: 6,
        type: 10,
        lifePoints: 78,
        size: 1.7,
        weight: 90.5,
        imageUrl: 'https://example.com/charizard.png',
      };

      const createdPokemonCard = {
        id: 4,
        name: 'Charizard',
        pokedexID: 6,
        lifePoints: 78,
        size: 1.7,
        weight: 90.5,
        imageUrl: 'https://example.com/charizard.png',
        typeId: 10,
        type: { id: 10, name: 'Fire' },
      };

      prismaMock.type.findUnique.mockResolvedValue({ id: 10, name: 'Fire' });
      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(null);
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
      prismaMock.pokemonCard.create.mockResolvedValue(createdPokemonCard);

      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer mockedToken')
        .send(newPokemonCard);

      expect(response.status).toBe(201);
      expect(response.body.size).toBe(1.7);
      expect(response.body.weight).toBe(90.5);
      expect(response.body.imageUrl).toBe('https://example.com/charizard.png');
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: 'TestPokemon',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 if type does not exist', async () => {
      const newPokemonCard = {
        name: 'TestPokemon',
        pokedexId: 999,
        type: 999,
        lifePoints: 100,
      };

      prismaMock.type.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer mockedToken')
        .send(newPokemonCard);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('type');
    });

    it('should return 400 if name already exists', async () => {
      const newPokemonCard = {
        name: 'ExistingPokemon',
        pokedexId: 999,
        type: 1,
        lifePoints: 100,
      };

      prismaMock.type.findUnique.mockResolvedValue({ id: 1, name: 'Electric' });
      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({
        id: 99,
        name: 'ExistingPokemon',
        pokedexID: 500,
        lifePoints: 50,
        size: null,
        weight: null,
        imageUrl: null,
        typeId: 1,
      });

      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer mockedToken')
        .send(newPokemonCard);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('nom');
    });

    it('should return 400 if pokedexId already exists', async () => {
      const newPokemonCard = {
        name: 'NewPokemon',
        pokedexId: 25,
        type: 1,
        lifePoints: 100,
      };

      prismaMock.type.findUnique.mockResolvedValue({ id: 1, name: 'Electric' });
      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce(null);
      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({
        id: 1,
        name: 'Pikachu',
        pokedexID: 25,
        lifePoints: 35,
        size: null,
        weight: null,
        imageUrl: null,
        typeId: 1,
      });

      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer mockedToken')
        .send(newPokemonCard);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('pokedexId');
    });
  });

  describe('PATCH /pokemon-cards/:pokemonCardId', () => {
    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .patch('/pokemon-cards/1')
        .send({
          name: 'UpdatedPokemon',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Unauthorized');
    });

    it('should return 404 if PokemonCard is not found', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .patch('/pokemon-cards/99999')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: 'UpdatedPokemon',
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });

    it('should update a PokemonCard with valid data and token', async () => {
      const updatedPokemonCard = {
        id: 1,
        name: 'Pikachu Updated',
        pokedexID: 25,
        lifePoints: 75,
        size: 0.4,
        weight: 6.0,
        imageUrl: 'https://example.com/pikachu.png',
        typeId: 1,
        type: { id: 1, name: 'Electric' },
      };

      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({
        id: 1,
        name: 'Pikachu',
        pokedexID: 25,
        lifePoints: 35,
        size: 0.4,
        weight: 6.0,
        imageUrl: 'https://example.com/pikachu.png',
        typeId: 1,
      });
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
      prismaMock.pokemonCard.update.mockResolvedValue(updatedPokemonCard);

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: 'Pikachu Updated',
          lifePoints: 75,
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Pikachu Updated');
      expect(response.body.lifePoints).toBe(75);
    });

    it('should return 400 if updated type does not exist', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({
        id: 1,
        name: 'Pikachu',
        pokedexID: 25,
        lifePoints: 35,
        size: null,
        weight: null,
        imageUrl: null,
        typeId: 1,
      });
      prismaMock.type.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          type: 999,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('type');
    });

    it('should return 400 if updated name already exists', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({
        id: 1,
        name: 'Pikachu',
        pokedexID: 25,
        lifePoints: 35,
        size: null,
        weight: null,
        imageUrl: null,
        typeId: 1,
      });
      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({
        id: 2,
        name: 'Charizard',
        pokedexID: 6,
        lifePoints: 78,
        size: null,
        weight: null,
        imageUrl: null,
        typeId: 1,
      });

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: 'Charizard',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('nom');
    });

    it('should return 400 if updated pokedexId already exists', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({
        id: 1,
        name: 'Pikachu',
        pokedexID: 25,
        lifePoints: 35,
        size: null,
        weight: null,
        imageUrl: null,
        typeId: 1,
      });
      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({
        id: 2,
        name: 'Charizard',
        pokedexID: 6,
        lifePoints: 78,
        size: null,
        weight: null,
        imageUrl: null,
        typeId: 1,
      });

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          pokedexId: 6,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('pokedexId');
    });

    it('should update with size = 0', async () => {
      const updatedPokemonCard = {
        id: 1,
        name: 'Pikachu Updated',
        pokedexID: 25,
        lifePoints: 75,
        size: 0,
        weight: 6.0,
        imageUrl: 'https://example.com/pikachu.png',
        typeId: 1,
        type: { id: 1, name: 'Electric' },
      };

      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({
        id: 1,
        name: 'Pikachu',
        pokedexID: 25,
        lifePoints: 35,
        size: 0.4,
        weight: 6.0,
        imageUrl: 'https://example.com/pikachu.png',
        typeId: 1,
      });
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
      prismaMock.pokemonCard.update.mockResolvedValue(updatedPokemonCard);

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          size: 0,
        });

      expect(response.status).toBe(200);
      expect(response.body.size).toBe(0);
    });

    it('should update with weight = 0', async () => {
      const updatedPokemonCard = {
        id: 1,
        name: 'Pikachu Updated',
        pokedexID: 25,
        lifePoints: 75,
        size: 0.4,
        weight: 0,
        imageUrl: 'https://example.com/pikachu.png',
        typeId: 1,
        type: { id: 1, name: 'Electric' },
      };

      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({
        id: 1,
        name: 'Pikachu',
        pokedexID: 25,
        lifePoints: 35,
        size: 0.4,
        weight: 6.0,
        imageUrl: 'https://example.com/pikachu.png',
        typeId: 1,
      });
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
      prismaMock.pokemonCard.update.mockResolvedValue(updatedPokemonCard);

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          weight: 0,
        });

      expect(response.status).toBe(200);
      expect(response.body.weight).toBe(0);
    });

    it('should update with lifePoints = 0', async () => {
      const updatedPokemonCard = {
        id: 1,
        name: 'Pikachu',
        pokedexID: 25,
        lifePoints: 0,
        size: 0.4,
        weight: 6.0,
        imageUrl: 'https://example.com/pikachu.png',
        typeId: 1,
        type: { id: 1, name: 'Electric' },
      };

      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({
        id: 1,
        name: 'Pikachu',
        pokedexID: 25,
        lifePoints: 35,
        size: 0.4,
        weight: 6.0,
        imageUrl: 'https://example.com/pikachu.png',
        typeId: 1,
      });
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
      prismaMock.pokemonCard.update.mockResolvedValue(updatedPokemonCard);

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          lifePoints: 0,
        });

      expect(response.status).toBe(200);
      expect(response.body.lifePoints).toBe(0);
    });

    it('should update with imageUrl', async () => {
      const updatedPokemonCard = {
        id: 1,
        name: 'Pikachu',
        pokedexID: 25,
        lifePoints: 35,
        size: 0.4,
        weight: 6.0,
        imageUrl: 'https://example.com/pikachu-new.png',
        typeId: 1,
        type: { id: 1, name: 'Electric' },
      };

      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({
        id: 1,
        name: 'Pikachu',
        pokedexID: 25,
        lifePoints: 35,
        size: 0.4,
        weight: 6.0,
        imageUrl: 'https://example.com/pikachu.png',
        typeId: 1,
      });
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
      prismaMock.pokemonCard.update.mockResolvedValue(updatedPokemonCard);

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          imageUrl: 'https://example.com/pikachu-new.png',
        });

      expect(response.status).toBe(200);
      expect(response.body.imageUrl).toBe('https://example.com/pikachu-new.png');
    });

    it('should update without providing imageUrl field', async () => {
      const updatedPokemonCard = {
        id: 1,
        name: 'Pikachu',
        pokedexID: 25,
        lifePoints: 35,
        size: 0.4,
        weight: 6.0,
        imageUrl: 'https://example.com/pikachu.png',
        typeId: 1,
        type: { id: 1, name: 'Electric' },
      };

      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({
        id: 1,
        name: 'Pikachu',
        pokedexID: 25,
        lifePoints: 35,
        size: 0.4,
        weight: 6.0,
        imageUrl: 'https://example.com/pikachu.png',
        typeId: 1,
      });
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
      prismaMock.pokemonCard.update.mockResolvedValue(updatedPokemonCard);

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          size: 0.4,
        });

      expect(response.status).toBe(200);
      expect(response.body.imageUrl).toBe('https://example.com/pikachu.png');
    });

    it('should update pokedexId', async () => {
      const updatedPokemonCard = {
        id: 1,
        name: 'Pikachu',
        pokedexID: 27,
        lifePoints: 35,
        size: 0.4,
        weight: 6.0,
        imageUrl: 'https://example.com/pikachu.png',
        typeId: 1,
        type: { id: 1, name: 'Electric' },
      };

      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({
        id: 1,
        name: 'Pikachu',
        pokedexID: 25,
        lifePoints: 35,
        size: 0.4,
        weight: 6.0,
        imageUrl: 'https://example.com/pikachu.png',
        typeId: 1,
      });
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
      prismaMock.pokemonCard.update.mockResolvedValue(updatedPokemonCard);

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          pokedexId: 27,
        });

      expect(response.status).toBe(200);
      expect(response.body.pokedexID).toBe(27);
    });

    it('should update with empty imageUrl', async () => {
      const updatedPokemonCard = {
        id: 1,
        name: 'Pikachu',
        pokedexID: 25,
        lifePoints: 35,
        size: 0.4,
        weight: 6.0,
        imageUrl: 'https://example.com/pikachu.png',
        typeId: 1,
        type: { id: 1, name: 'Electric' },
      };

      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({
        id: 1,
        name: 'Pikachu',
        pokedexID: 25,
        lifePoints: 35,
        size: 0.4,
        weight: 6.0,
        imageUrl: 'https://example.com/pikachu.png',
        typeId: 1,
      });
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
      prismaMock.pokemonCard.update.mockResolvedValue(updatedPokemonCard);

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          imageUrl: '',
        });

      expect(response.status).toBe(200);
    });

    it('should update with multiple fields', async () => {
      const updatedPokemonCard = {
        id: 1,
        name: 'Pikachu Updated',
        pokedexID: 26,
        lifePoints: 50,
        size: 0.5,
        weight: 7.0,
        imageUrl: 'https://example.com/pikachu-new.png',
        typeId: 1,
        type: { id: 1, name: 'Electric' },
      };

      prismaMock.pokemonCard.findUnique.mockResolvedValueOnce({
        id: 1,
        name: 'Pikachu',
        pokedexID: 25,
        lifePoints: 35,
        size: 0.4,
        weight: 6.0,
        imageUrl: 'https://example.com/pikachu.png',
        typeId: 1,
      });
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);
      prismaMock.pokemonCard.update.mockResolvedValue(updatedPokemonCard);

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: 'Pikachu Updated',
          pokedexId: 26,
          lifePoints: 50,
          size: 0.5,
          weight: 7.0,
          imageUrl: 'https://example.com/pikachu-new.png',
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Pikachu Updated');
      expect(response.body.pokedexID).toBe(26);
      expect(response.body.lifePoints).toBe(50);
      expect(response.body.size).toBe(0.5);
      expect(response.body.weight).toBe(7.0);
      expect(response.body.imageUrl).toBe('https://example.com/pikachu-new.png');
    });
  });

  describe('DELETE /pokemon-cards/:pokemonCardId', () => {
    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .delete('/pokemon-cards/1');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Unauthorized');
    });

    it('should return 404 if PokemonCard is not found', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .delete('/pokemon-cards/99999')
        .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });

    it('should delete a PokemonCard with valid token', async () => {
      prismaMock.pokemonCard.findUnique.mockResolvedValue({
        id: 2,
        name: 'Charizard',
        pokedexID: 6,
        lifePoints: 78,
        size: 1.7,
        weight: 90.5,
        imageUrl: 'https://example.com/charizard.png',
        typeId: 1,
      });
      prismaMock.pokemonCard.delete.mockResolvedValue({
        id: 2,
        name: 'Charizard',
        pokedexID: 6,
        lifePoints: 78,
        size: 1.7,
        weight: 90.5,
        imageUrl: 'https://example.com/charizard.png',
        typeId: 1,
      });

      const response = await request(app)
        .delete('/pokemon-cards/2')
        .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(204);
    });
  });

  describe('Error handling', () => {
    it('should handle GET /pokemons-cards error', async () => {
      prismaMock.pokemonCard.findMany.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/pokemons-cards');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Erreur serveur');
    });

    it('should handle GET /pokemons-cards/:id error', async () => {
      prismaMock.pokemonCard.findUnique.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/pokemons-cards/1');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Erreur serveur');
    });

    it('should handle POST /pokemon-cards error', async () => {
      prismaMock.type.findUnique.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: 'TestPokemon',
          pokedexId: 999,
          type: 1,
          lifePoints: 100,
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Erreur serveur');
    });

    it('should handle PATCH /pokemon-cards/:id error', async () => {
      prismaMock.pokemonCard.findUnique.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer mockedToken')
        .send({ name: 'Updated' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Erreur serveur');
    });

    it('should handle DELETE /pokemon-cards/:id error', async () => {
      prismaMock.pokemonCard.findUnique.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete('/pokemon-cards/1')
        .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Erreur serveur');
    });
  });
});
