import { Request, Response } from 'express';
import prisma from '../client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
            },
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        const user = await prisma.user.findUnique({
            where: { id: Number(userId) },
            select: {
                id: true,
                email: true,
            },
        });

        if (!user) {
            res.status(404).json({
                error: `User with id ${userId} not found`,
            });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Check if required fields are present
        if (!email || !password) {
            res.status(400).json({
                error: 'Email and password are required',
            });
            return;
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            res.status(400).json({
                error: 'Email already exists',
            });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
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

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const { email, password } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: Number(userId) },
        });

        if (!existingUser) {
            res.status(404).json({
                error: `User with id ${userId} not found`,
            });
            return;
        }

        // If email is being updated, check if it's already taken
        if (email && email !== existingUser.email) {
            const emailExists = await prisma.user.findUnique({
                where: { email },
            });

            if (emailExists) {
                res.status(400).json({
                    error: 'Email already exists',
                });
                return;
            }
        }

        // Update user
        const updateData: any = {};
        if (email) updateData.email = email;
        if (password) updateData.password = await bcrypt.hash(password, 10);

        const updatedUser = await prisma.user.update({
            where: { id: Number(userId) },
            data: updateData,
            select: {
                id: true,
                email: true,
            },
        });

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id: Number(userId) },
        });

        if (!existingUser) {
            res.status(404).json({
                error: `User with id ${userId} not found`,
            });
            return;
        }

        // Delete user
        await prisma.user.delete({
            where: { id: Number(userId) },
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Check if required fields are present
        if (!email || !password) {
            res.status(401).json({
                error: 'Unauthorized',
            });
            return;
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            res.status(401).json({
                error: 'Unauthorized',
            });
            return;
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({
                error: 'Unauthorized',
            });
            return;
        }

        // Create JWT
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
