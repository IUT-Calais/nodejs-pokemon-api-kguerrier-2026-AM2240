import request from 'supertest';
import { app } from '../src';

describe('Auth Middleware', () => {
    it('should return 401 with invalid JWT token', async () => {
        const response = await request(app)
            .get('/users')
            .set('Authorization', 'Bearer invalidToken');

        expect(response.status).toBe(401);
        expect(response.body.error).toContain('Unauthorized');
    });

    it('should return 401 with malformed authorization header', async () => {
        const response = await request(app)
            .get('/users')
            .set('Authorization', 'InvalidFormat mockedToken');

        expect(response.status).toBe(401);
        expect(response.body.error).toContain('Unauthorized');
    });
});
