import express from 'express';
import { createUser, loginUser } from './user.controller';

export const userRouter = express.Router();

userRouter.post('/', createUser);
userRouter.post('/login', loginUser);
