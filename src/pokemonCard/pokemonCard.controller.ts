import { Request, Response } from 'express';
import prisma from '../client';

export const getAllPokemonCards = async (req: Request, res: Response): Promise<void> => {
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

export const getPokemonCardByID = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pokemonCardId } = req.params;
    const pokemonCard = await prisma.pokemonCard.findUnique({
      where: { id: Number(pokemonCardId) },
      include: {
        type: true,
      },
    });

    if (!pokemonCard) {
      res.status(404).json({
        error: `Le pokemon avec l'id ${pokemonCardId} n'existe pas`
      });
      return;
    }
    res.status(200).json(pokemonCard);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" })
  }
};

export const createPokemonCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, pokedexId, type, lifePoints, size, weight, imageUrl } = req.body;

    // Vérifier les champs requis
    if (!name || !pokedexId || type === undefined || !lifePoints) {
      res.status(400).json({
        error: 'Les champs name, pokedexId, type et lifePoints sont requis'
      });
      return;
    }

    // Vérifier que le type existe
    const typeExists = await prisma.type.findUnique({
      where: { id: type },
    });
    if (!typeExists) {
      res.status(400).json({
        error: `Le type avec l'id ${type} n'existe pas`
      });
      return;
    }

    // Vérifier que name existe pas déjà
    const existingName = await prisma.pokemonCard.findUnique({
      where: { name },
    });
    if (existingName) {
      res.status(400).json({
        error: 'Un pokemon avec ce nom existe déjà'
      });
      return;
    }

    // Vérifier que pokedexId existe pas déjà
    const existingPokedexId = await prisma.pokemonCard.findUnique({
      where: { pokedexID: pokedexId },
    });
    if (existingPokedexId) {
      res.status(400).json({
        error: 'Un pokemon avec ce pokedexId existe déjà'
      });
      return;
    }

    // Créer le pokémon
    const pokemonCard = await prisma.pokemonCard.create({
      data: {
        name,
        pokedexID: pokedexId,
        typeId: type,
        lifePoints,
        size: size || undefined,
        weight: weight || undefined,
        imageUrl: imageUrl || undefined,
      },
      include: {
        type: true,
      },
    });

    res.status(201).json(pokemonCard);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const updatePokemonCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pokemonCardId } = req.params;
    const { name, pokedexId, type, lifePoints, size, weight, imageUrl } = req.body;

    // Vérifier que le pokémon existe
    const existingPokemon = await prisma.pokemonCard.findUnique({
      where: { id: Number(pokemonCardId) },
    });
    if (!existingPokemon) {
      res.status(404).json({
        error: `Le pokemon avec l'id ${pokemonCardId} n'existe pas`
      });
      return;
    }

    // Si type est fourni, vérifier qu'il existe
    if (type !== undefined) {
      const typeExists = await prisma.type.findUnique({
        where: { id: type },
      });
      if (!typeExists) {
        res.status(400).json({
          error: `Le type avec l'id ${type} n'existe pas`
        });
        return;
      }
    }

    // Si name est fourni, vérifier qu'il existe pas ailleurs
    if (name && name !== existingPokemon.name) {
      const existingName = await prisma.pokemonCard.findUnique({
        where: { name },
      });
      if (existingName) {
        res.status(400).json({
          error: 'Un pokemon avec ce nom existe déjà'
        });
        return;
      }
    }

    // Si pokedexId est fourni, vérifier qu'il existe pas ailleurs
    if (pokedexId && pokedexId !== existingPokemon.pokedexID) {
      const existingPokedexId = await prisma.pokemonCard.findUnique({
        where: { pokedexID: pokedexId },
      });
      if (existingPokedexId) {
        res.status(400).json({
          error: 'Un pokemon avec ce pokedexId existe déjà'
        });
        return;
      }
    }

    // Mettre à jour le pokémon
    const updatedPokemonCard = await prisma.pokemonCard.update({
      where: { id: Number(pokemonCardId) },
      data: {
        ...(name && { name }),
        ...(pokedexId && { pokedexID: pokedexId }),
        ...(type !== undefined && { typeId: type }),
        ...(lifePoints && { lifePoints }),
        ...(size !== undefined && { size }),
        ...(weight !== undefined && { weight }),
        ...(imageUrl && { imageUrl }),
      },
      include: {
        type: true,
      },
    });

    res.status(200).json(updatedPokemonCard);
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const deletePokemonCard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pokemonCardId } = req.params;

    // Vérifier que le pokémon existe
    const existingPokemon = await prisma.pokemonCard.findUnique({
      where: { id: Number(pokemonCardId) },
    });
    if (!existingPokemon) {
      res.status(404).json({
        error: `Le pokemon avec l'id ${pokemonCardId} n'existe pas`
      });
      return;
    }

    // Supprimer le pokémon
    await prisma.pokemonCard.delete({
      where: { id: Number(pokemonCardId) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};