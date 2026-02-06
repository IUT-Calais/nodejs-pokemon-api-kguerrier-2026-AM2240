import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllPokemonCards = async (req: Request, res: Response) => {
  try {
    const pokemonCards = await prisma.pokemonCard.findMany({
      include: {
        type: true,
      },
    });
    res.status(200).json(pokemonCards);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};