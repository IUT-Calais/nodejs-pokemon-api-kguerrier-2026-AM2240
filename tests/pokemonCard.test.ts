import request from 'supertest';
import { app } from '../src';

describe('PokemonCard API', () => {
  // TODO: Tests will be implemented
});
    it('should fetch all PokemonCards', async () => {
      const response = await request(app).get('/pokemons-cards');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /pokemons-cards/:pokemonCardId', () => {
    it('should fetch a PokemonCard by ID', async () => {
      const response = await request(app).get('/pokemons-cards/1');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.name).toBeDefined();
      expect(response.body.pokedexID).toBeDefined();
      expect(response.body.lifePoints).toBeDefined();
      expect(response.body.typeId).toBeDefined();
    });

    it('should return 404 if PokemonCard is not found', async () => {
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
      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: 'TestPokemon99999',
          pokedexId: 99999,
          type: 99999,
          lifePoints: 100,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('type');
    });

    it('should return 400 if name already exists', async () => {
      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: 'Pikachu',
          pokedexId: 9999,
          type: 1,
          lifePoints: 100,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('existe');
    });

    it('should return 400 if pokedexId already exists', async () => {
      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: 'UniquePokemon9999',
          pokedexId: 25,
          type: 1,
          lifePoints: 100,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('existe');
    });

    it('should create a new PokemonCard with valid token', async () => {
      const uniqueName = `TestPokemon${Date.now()}`;
      const uniquePokedexId = 99000 + Math.floor(Math.random() * 900);

      const response = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: uniqueName,
          pokedexId: uniquePokedexId,
          type: 1,
          lifePoints: 100,
          size: 1.0,
          weight: 10.0,
          imageUrl: 'https://example.com/image.png',
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(uniqueName);
      expect(response.body.pokedexID).toBe(uniquePokedexId);
      expect(response.body.lifePoints).toBe(100);
    });
  });

  describe('PATCH /pokemon-cards/:pokemonCardId', () => {
    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .patch('/pokemon-cards/1')
        .send({ lifePoints: 100 });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Unauthorized');
    });

    it('should return 404 if PokemonCard not found', async () => {
      const response = await request(app)
        .patch('/pokemon-cards/99999')
        .set('Authorization', 'Bearer mockedToken')
        .send({ lifePoints: 100 });

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 if type does not exist', async () => {
      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer mockedToken')
        .send({ type: 99999 });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('type');
    });

    it('should update an existing PokemonCard', async () => {
      const response = await request(app)
        .patch('/pokemon-cards/1')
        .set('Authorization', 'Bearer mockedToken')
        .send({ lifePoints: 9999 });

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.lifePoints).toBe(9999);
    });
  });

  describe('DELETE /pokemon-cards/:pokemonCardId', () => {
    it('should return 401 without authentication token', async () => {
      const response = await request(app).delete('/pokemon-cards/1');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Unauthorized');
    });

    it('should return 404 if PokemonCard not found', async () => {
      const response = await request(app)
        .delete('/pokemon-cards/99999')
        .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });

    it('should delete a PokemonCard', async () => {
      // Create a Pokemon first
      const uniqueName = `DeleteTest${Date.now()}`;
      const createRes = await request(app)
        .post('/pokemon-cards')
        .set('Authorization', 'Bearer mockedToken')
        .send({
          name: uniqueName,
          pokedexId: 98000 + Math.floor(Math.random() * 900),
          type: 1,
          lifePoints: 50,
        });

      const pokemonId = createRes.body.id;

      // Now delete it
      const response = await request(app)
        .delete(`/pokemon-cards/${pokemonId}`)
        .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(204);
    });
  });
});
