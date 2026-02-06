import express from "express";
import { getAllPokemonCards } from "./pokemonCard.controller";

export const pokemonCardRouter = express.Router();

pokemonCardRouter.get("/", getAllPokemonCards);