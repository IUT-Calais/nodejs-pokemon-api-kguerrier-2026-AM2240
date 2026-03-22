import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Pokémon Card API',
        description: 'API pour gérer les cartes Pokémon et les utilisateurs',
        version: '1.0.0',
        contact: {
            name: 'API Support',
            url: 'https://github.com',
        },
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            PokemonCard: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    name: { type: 'string', example: 'Pikachu' },
                    pokedexID: { type: 'integer', example: 25 },
                    lifePoints: { type: 'integer', example: 60 },
                    size: { type: 'number', example: 0.4 },
                    weight: { type: 'number', example: 6.0 },
                    imageUrl: {
                        type: 'string',
                        example: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png',
                    },
                    typeId: { type: 'integer', example: 5 },
                    type: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer', example: 5 },
                            name: { type: 'string', example: 'Electric' },
                        },
                    },
                },
            },
            User: {
                type: 'object',
                properties: {
                    id: { type: 'integer', example: 1 },
                    email: { type: 'string', example: 'admin@gmail.com' },
                },
            },
            Error: {
                type: 'object',
                properties: {
                    error: { type: 'string' },
                },
            },
        },
    },
    paths: {
        '/pokemons-cards': {
            get: {
                summary: 'Récupérer tous les pokémons',
                tags: ['PokemonCard'],
                responses: {
                    200: {
                        description: 'Liste de tous les pokémons',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/PokemonCard' },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/pokemons-cards/{pokemonCardId}': {
            get: {
                summary: 'Récupérer un pokémon par ID',
                tags: ['PokemonCard'],
                parameters: [
                    {
                        name: 'pokemonCardId',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                        example: 1,
                    },
                ],
                responses: {
                    200: {
                        description: 'Pokémon trouvé',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/PokemonCard' },
                            },
                        },
                    },
                    404: {
                        description: 'Pokémon non trouvé',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/pokemon-cards': {
            post: {
                summary: 'Créer un pokémon (authentification requise)',
                tags: ['PokemonCard'],
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name', 'pokedexId', 'type', 'lifePoints'],
                                properties: {
                                    name: { type: 'string', example: 'Moltres' },
                                    pokedexId: { type: 'integer', example: 146 },
                                    type: { type: 'integer', example: 2 },
                                    lifePoints: { type: 'integer', example: 90 },
                                    size: { type: 'number', example: 2.0 },
                                    weight: { type: 'number', example: 60.0 },
                                    imageUrl: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Pokémon créé',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/PokemonCard' },
                            },
                        },
                    },
                    400: {
                        description: 'Erreur de validation',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                    401: {
                        description: 'Non authentifié',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/pokemon-cards/{pokemonCardId}': {
            patch: {
                summary: 'Modifier un pokémon (authentification requise)',
                tags: ['PokemonCard'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'pokemonCardId',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    pokedexId: { type: 'integer' },
                                    type: { type: 'integer' },
                                    lifePoints: { type: 'integer' },
                                    size: { type: 'number' },
                                    weight: { type: 'number' },
                                    imageUrl: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Pokémon modifié',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/PokemonCard' },
                            },
                        },
                    },
                    400: {
                        description: 'Erreur de validation',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                    401: {
                        description: 'Non authentifié',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                    404: {
                        description: 'Pokémon non trouvé',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
            delete: {
                summary: 'Supprimer un pokémon (authentification requise)',
                tags: ['PokemonCard'],
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: 'pokemonCardId',
                        in: 'path',
                        required: true,
                        schema: { type: 'integer' },
                    },
                ],
                responses: {
                    200: {
                        description: 'Pokémon supprimé',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                    401: {
                        description: 'Non authentifié',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                    404: {
                        description: 'Pokémon non trouvé',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/users': {
            post: {
                summary: 'Créer un utilisateur',
                tags: ['User'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string', example: 'user@example.com' },
                                    password: { type: 'string', example: 'password123' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: 'Utilisateur créé',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/User' },
                            },
                        },
                    },
                    400: {
                        description: 'Erreur de validation',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
        '/users/login': {
            post: {
                summary: 'Se connecter',
                tags: ['User'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string', example: 'user@example.com' },
                                    password: { type: 'string', example: 'password123' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Connexion réussie',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        token: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Email ou mot de passe incorrect',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                    401: {
                        description: 'Non autorisé',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Error' },
                            },
                        },
                    },
                },
            },
        },
    },
};

export const setupSwagger = (app: Express) => {
    app.use('/api-docs', swaggerUi.serve);
    app.use(
        '/api-docs',
        swaggerUi.setup(swaggerDocument, {
            swaggerOptions: {
                url: '/api-docs.json',
            },
        })
    );
};
