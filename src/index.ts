import express from 'express';
import { pokemonCardGetRouter, pokemonCardCrudRouter } from './pokemonCard/pokemonCard.router';
import { userRouter } from './user/user.router';


export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());



export const server = app.listen(port);

export function stopServer() {
  server.close();
}

// Routes User
app.use("/users", userRouter);

// Routes GET
app.use("/pokemons-cards", pokemonCardGetRouter);

// Routes POST/PATCH/DELETE
app.use("/pokemon-cards", pokemonCardCrudRouter);
