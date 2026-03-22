import express from 'express';
import { pokemonCardGetRouter, pokemonCardCrudRouter } from './pokemonCard/pokemonCard.router';
import { userRouter } from './user/user.router';
import { setupSwagger } from './swagger';

export const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Setup Swagger documentation
setupSwagger(app);

let server: any;

export function startServer() {
  server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use`);
      process.exit(1);
    } else {
      throw err;
    }
  });

  return server;
}

// c8 ignore start
if (process.env.NODE_ENV !== 'test') {
  startServer();
} else {
  server = app;
}
// c8 ignore end

export { server };

export function stopServer() {
  if (server && server.close) {
    server.close();
  }
}

// Routes User
app.use("/users", userRouter);

// Routes GET
app.use("/pokemons-cards", pokemonCardGetRouter);

// Routes POST/PATCH/DELETE
app.use("/pokemon-cards", pokemonCardCrudRouter);