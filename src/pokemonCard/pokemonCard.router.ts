import express from "express";
import { getAllPokemonCards, getPokemonCardByID, createPokemonCard, updatePokemonCard, deletePokemonCard } from "./pokemonCard.controller";
import { authMiddleware } from "../middleware/authMiddleware";

export const pokemonCardGetRouter = express.Router();
export const pokemonCardCrudRouter = express.Router();


pokemonCardGetRouter.get("/", getAllPokemonCards);
pokemonCardGetRouter.get('/:pokemonCardId', getPokemonCardByID);


pokemonCardCrudRouter.post("/", authMiddleware, createPokemonCard);
pokemonCardCrudRouter.patch("/:pokemonCardId", authMiddleware, updatePokemonCard);
pokemonCardCrudRouter.delete("/:pokemonCardId", authMiddleware, deletePokemonCard);