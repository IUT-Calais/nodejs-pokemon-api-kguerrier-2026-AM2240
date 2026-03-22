import request from 'supertest';
import { app } from '../src';
import { prismaMock } from './jest.setup';

describe('User API', () => {
  describe('POST /users', () => {
    it('should create a new user', async () => {
      const uniqueEmail = `test${Date.now()}@example.com`;

      // Mock: email doesn't exist yet
      prismaMock.user.findUnique.mockResolvedValueOnce(null);
      // Mock: user is created successfully
      prismaMock.user.create.mockResolvedValueOnce({
        id: 1,
        email: uniqueEmail,
        password: 'hashedPassword',
      });

      const response = await request(app)
        .post('/users')
        .send({
          email: uniqueEmail,
          password: 'password123',
        });

      expect(response.status).toBe(201);
      expect(response.body.email).toBe(uniqueEmail);
      expect(response.body.id).toBeDefined();
      expect(response.body.password).toBeUndefined();
    });

    it('should return 400 if email already exists', async () => {
      const uniqueEmail = `duplicate${Date.now()}@example.com`;

      // Mock: email already exists
      prismaMock.user.findUnique.mockResolvedValueOnce({
        id: 1,
        email: uniqueEmail,
        password: 'hashedPassword',
      });

      const response = await request(app)
        .post('/users')
        .send({
          email: uniqueEmail,
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('already exists');
    });

    it('should return 400 if email is missing', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          password: 'password123',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 if password is missing', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          email: `test${Date.now()}@example.com`,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /users/login', () => {
    it('should login a user and return a token', async () => {
      // Mock: user with matching email is found
      prismaMock.user.findUnique.mockResolvedValueOnce({
        id: 1,
        email: 'admin@gmail.com',
        password: '$2b$10$N9qo8uLOickgx2ZMRZoM.e/1wl5nFxmvGBGEHV7oEz0qnLkPtWmS/W', // bcrypt hash of 'truePassword'
      });

      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'admin@gmail.com',
          password: 'truePassword',
        });

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.token).toBe('mockedToken');
    });

    it('should return 401 if password is incorrect', async () => {
      // Mock: user is found
      prismaMock.user.findUnique.mockResolvedValueOnce({
        id: 1,
        email: 'admin@gmail.com',
        password: '$2b$10$N9qo8uLOickgx2ZMRZoM.e/1wl5nFxmvGBGEHV7oEz0qnLkPtWmS/W', // bcrypt hash of 'truePassword'
      });

      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'admin@gmail.com',
          password: 'wrongPassword',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Unauthorized');
    });

    it('should return 401 if user does not exist', async () => {
      // Mock: user not found
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Unauthorized');
    });

    it('should return 401 if email is missing', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Unauthorized');
    });

    it('should return 401 if password is missing', async () => {
      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'admin@gmail.com',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Unauthorized');
    });
  });

  describe('GET /users', () => {
    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .get('/users');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Unauthorized');
    });

    it('should fetch all users with valid token', async () => {
      // Mock: return list of users
      prismaMock.user.findMany.mockResolvedValueOnce([
        { id: 1, email: 'user1@example.com', password: 'hash1' },
        { id: 2, email: 'user2@example.com', password: 'hash2' },
      ]);

      const response = await request(app)
        .get('/users')
        .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /users/:userId', () => {
    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .get('/users/1');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Unauthorized');
    });

    it('should fetch a user by ID with valid token', async () => {
      // Mock: user is found
      prismaMock.user.findUnique.mockResolvedValueOnce({
        id: 1,
        email: 'user1@example.com',
        password: 'hashedPassword',
      });

      const response = await request(app)
        .get('/users/1')
        .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(200);
      expect(response.body.id).toBeDefined();
      expect(response.body.email).toBeDefined();
    });

    it('should return 404 if user is not found', async () => {
      // Mock: user not found
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      const response = await request(app)
        .get('/users/99999')
        .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('PATCH /users/:userId', () => {
    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .patch('/users/1')
        .send({ email: 'updated@example.com' });

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Unauthorized');
    });

    it('should return 404 if user is not found', async () => {
      // Mock: user not found
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      const response = await request(app)
        .patch('/users/99999')
        .set('Authorization', 'Bearer mockedToken')
        .send({ email: 'updated@example.com' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });

    it('should update user email with valid token', async () => {
      const newEmail = `updated${Date.now()}@example.com`;

      // Mock: user is found
      prismaMock.user.findUnique.mockResolvedValueOnce({
        id: 1,
        email: 'old@example.com',
        password: 'hashedPassword',
      });
      // Mock: updated user is returned
      prismaMock.user.update.mockResolvedValueOnce({
        id: 1,
        email: newEmail,
        password: 'hashedPassword',
      });

      const response = await request(app)
        .patch('/users/1')
        .set('Authorization', 'Bearer mockedToken')
        .send({ email: newEmail });

      expect(response.status).toBe(200);
      expect(response.body.email).toBe(newEmail);
    });

    it('should update user password with valid token', async () => {
      // Mock: user is found
      prismaMock.user.findUnique.mockResolvedValueOnce({
        id: 1,
        email: 'user@example.com',
        password: 'hashedPassword',
      });
      // Mock: updated user is returned
      prismaMock.user.update.mockResolvedValueOnce({
        id: 1,
        email: 'user@example.com',
        password: 'newHashedPassword',
      });

      const response = await request(app)
        .patch('/users/1')
        .set('Authorization', 'Bearer mockedToken')
        .send({ password: 'newPassword123' });

      expect(response.status).toBe(200);
      expect(response.body.id).toBeDefined();
    });

    it('should return 400 if email already exists', async () => {
      const uniqueEmail = `user${Date.now()}@example.com`;

      // Mock: user is found
      prismaMock.user.findUnique.mockResolvedValueOnce({
        id: 1,
        email: 'old@example.com',
        password: 'hashedPassword',
      });
      // Mock: another user with the new email exists
      prismaMock.user.findUnique.mockResolvedValueOnce({
        id: 2,
        email: uniqueEmail,
        password: 'otherPassword',
      });

      const response = await request(app)
        .patch('/users/1')
        .set('Authorization', 'Bearer mockedToken')
        .send({ email: uniqueEmail });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('already exists');
    });
  });

  describe('DELETE /users/:userId', () => {
    it('should return 401 without authentication token', async () => {
      const response = await request(app)
        .delete('/users/1');

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('Unauthorized');
    });

    it('should return 404 if user is not found', async () => {
      // Mock: user not found
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      const response = await request(app)
        .delete('/users/99999')
        .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });

    it('should delete a user with valid token', async () => {
      // Mock: user is found
      prismaMock.user.findUnique.mockResolvedValueOnce({
        id: 1,
        email: 'user@example.com',
        password: 'hashedPassword',
      });
      // Mock: user is deleted
      prismaMock.user.delete.mockResolvedValueOnce({
        id: 1,
        email: 'user@example.com',
        password: 'hashedPassword',
      });

      const response = await request(app)
        .delete('/users/1')
        .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(204);
    });
  });

  describe('Error handling', () => {
    it('should handle POST /users error', async () => {
      prismaMock.user.findUnique.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/users')
        .send({
          email: `test${Date.now()}@example.com`,
          password: 'password123',
        });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });

    it('should handle POST /users/login error', async () => {
      prismaMock.user.findUnique.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/users/login')
        .send({
          email: 'admin@gmail.com',
          password: 'password123',
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Unauthorized');
    });

    it('should handle GET /users error', async () => {
      prismaMock.user.findMany.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/users')
        .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });

    it('should handle GET /users/:userId error', async () => {
      prismaMock.user.findUnique.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/users/1')
        .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });

    it('should handle PATCH /users/:userId error', async () => {
      prismaMock.user.findUnique.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .patch('/users/1')
        .set('Authorization', 'Bearer mockedToken')
        .send({ email: 'updated@example.com' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });

    it('should handle DELETE /users/:userId error', async () => {
      prismaMock.user.findUnique.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete('/users/1')
        .set('Authorization', 'Bearer mockedToken');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });
});
