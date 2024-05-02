import fs from "fs/promises";
import path from "path";

//a function that will be used to creat a folder
const createFolder = async (folderName) => {
  const dir = `.${path.sep}${folderName}`;
  try {
    await fs.access(dir);
  } catch (error) {
    fs.mkdir(dir);
  }
};

// const pokemonObject = await fetchPokemon("flareon");

//saving stats and creating a folder(if it is not already created,created a new one)
const savePokemonStats = async (folderName, savePokemonStatsObject) => {
  let statString = "";
  for (const stat of savePokemonStatsObject) {
    statString += `${stat.stat.name}: ${stat.base_stat} \n`; //gathering all stats and concat them in a string
  }

  await createFolder(folderName); //calling folder creation function
  const filePath = `.${path.sep}${folderName}${path.sep}stats.txt`; // deciding the name of path
  await fs.writeFile(filePath, statString); //saving text file(stats.txt)
};

//saving artowrk in the folder that have been created(if it is not already created,creates a new one)
const savePokemonArtwork = async (folderName, pokemonSpritesObject) => {
  const url = pokemonSpritesObject.other["official-artwork"].front_default; //retrieving the source of picture from the api

  const fetching_url = await fetch(url); //fetching
  const pokemon_image = await fetching_url.arrayBuffer(); //decoding the picture
  //folder create
  await createFolder(folderName);
  await fs.writeFile(
    `.${path.sep}${folderName}${path.sep}official-artwork.png`, //deciding the path
    Buffer.from(pokemon_image)
  );
};

//saving sprites(all at once) and creating a folder(if it is not already created)
const savePokemonSprites = async (folderName, pokemonSpritesObject) => {
  for (const [key, url] of Object.entries(pokemonSpritesObject)) {
    //checking the "spites object and retrieving only the link of the pictures"
    if (typeof url === "string") {
      //if urlis a string(link for the picture)
      //url is the actual link eg: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/136.png
      const fetching_url = await fetch(url);
      const pokemon_sprite = await fetching_url.arrayBuffer();
      //folder creation
      await createFolder(folderName); //folder create
      //file saving
      await fs.writeFile(
        `.${path.sep}${folderName}${path.sep}${key}.png`, //key is the description of the sprite e.g "front default"
        Buffer.from(pokemon_sprite)
      );
    }
  }
};
//recieving the json and the user options and calling the functions that should be executed

const checking = async (pokemonObject, optionsObject) => {
  const options = optionsObject.options;
  const pokemon_Name = pokemonObject.name;
  for (const choice of options) {
    if (choice === "Stats") {
      await savePokemonStats(pokemon_Name, pokemonObject.stats);
    }
    if (choice === "Sprites") {
      await savePokemonSprites(pokemon_Name, pokemonObject.sprites);
    }
    if (choice === "Official artwork") {
      savePokemonArtwork(pokemon_Name, pokemonObject.sprites);
    }
  }
};

export { checking };
 