import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {


  await prisma.pokemonCard.deleteMany();
  await prisma.type.deleteMany();


  await prisma.type.createMany({
    data: [
      { name: 'Normal' },
      { name: 'Fire' },
      { name: 'Water' },
      { name: 'Grass' },
      { name: 'Electric' },
      { name: 'Ice' },
      { name: 'Fighting' },
      { name: 'Poison' },
      { name: 'Ground' },
      { name: 'Flying' },
      { name: 'Psychic' },
      { name: 'Bug' },
      { name: 'Rock' },
      { name: 'Ghost' },
      { name: 'Dragon' },
      { name: 'Dark' },
      { name: 'Steel' },
      { name: 'Fairy' },
    ],
  });

  await prisma.pokemonCard.create({
    data: 
      { name: 'Pikachu', 
        type: {connect: {name : 'Electric'},}, 
        pokedexID: 25, 
        lifePoints: 60, 
        size: 10.0, 
        weight: 6.0, 
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/025.png' },
  });

  await prisma.pokemonCard.create({
    data: 
      { name: 'Charizard',
        type: {connect: {name : 'Fire'}},
        pokedexID: 6,
        lifePoints: 120,
        size: 1.7,
        weight: 90.5,
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/006.png' },
  });

  await prisma.pokemonCard.create({
    data:
      {
        name: 'Squirtle', 
        type: {connect: {name : 'Water'}}, 
        pokedexID: 7, 
        lifePoints: 50, 
        size: 5.0, 
        weight: 9.0, 
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png'
      },
  })

  await prisma.pokemonCard.create({
    data :
      { name: 'Bulbasaur', 
        type: {connect: {name: 'Grass'}}, 
        pokedexID: 1, 
        lifePoints: 50, 
        size: 7.0, 
        weight: 6.9, 
        imageUrl: 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png' 
      },
    
  })


  console.log('Seed completed!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
