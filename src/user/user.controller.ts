import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Vérifier que les champs requis sont présents
        if (!email || !password) {
            res.status(400).json({
                error: 'Email and password are required',
            });
            return;
        }

        // Vérifier que l'email existe pas déjà
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            res.status(400).json({
                error: 'Email already exists',
            });
            return;
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'utilisateur
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        res.status(201).json({
            id: user.id,
            email: user.email,
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Vérifier que les champs requis sont présents
        if (!email || !password) {
            res.status(401).json({
                error: 'Unauthorized',
            });
            return;
        }

        // Trouver l'utilisateur par email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            res.status(401).json({
                error: 'Unauthorized',
            });
            return;
        }

        // Comparer les mots de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({
                error: 'Unauthorized',
            });
            return;
        }

        // Créer le JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: process.env.JWT_EXPIRATION || '24h' }
        );

        res.status(200).json({
            token,
        });
    } catch (error) {
        res.status(401).json({
            error: 'Unauthorized',
        });
    }
};
