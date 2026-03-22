import express from 'express';
import { createUser, loginUser, getAllUsers, getUserById, updateUser, deleteUser } from './user.controller';
import { authMiddleware } from '../middleware/authMiddleware';

export const userRouter = express.Router();

// Public routes
userRouter.post('/', createUser);
userRouter.post('/login', loginUser);

// Protected routes
userRouter.get('/', authMiddleware, getAllUsers);
userRouter.get('/:userId', authMiddleware, getUserById);
userRouter.patch('/:userId', authMiddleware, updateUser);
userRouter.delete('/:userId', authMiddleware, deleteUser);
