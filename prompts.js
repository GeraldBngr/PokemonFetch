import fetch from "node-fetch";
import inquirer from "inquirer";
import { checking } from "./saving.js";

//pokemon Name
const promptForPokemon = async () => {
  return await inquirer.prompt({
    type: "input",
    name: "pokemon_name",
    message: "Provide us with the pokemon you would like to examine",
  });
};

//checkbox
const promptForDownloadInfo = async () => {
  return await inquirer.prompt({
    type: "checkbox",
    message: "Pokemon info to download!",
    name: "options",
    choices: [
      {
        name: "Stats",
      },
      {
        name: "Sprites",
      },
      {
        name: "Official artwork",
      },
    ],
  });
};

//continue

const promptToContinue = async () => {
  return await inquirer.prompt({
    type: "list",
    message: "Would you like to search for another pokemon",
    name: "continue",
    choices: ["Yes", "No"],
  });
};

//fetch
const fetchPokemon = async (pokemonName) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
  const response = await fetch(url);
  const json = await response.json();
  return json;
};

//asking user to repeat
const promptUser = async () => {
  while (true) {
    const pokemon_Name = await promptForPokemon();
    const pokemonJSON = await fetchPokemon(pokemon_Name.pokemon_name);

    const pokemonOptions = await promptForDownloadInfo();

    console.log(`You chose ${pokemonOptions.options}`);
    await checking(pokemonJSON, pokemonOptions);
    const keep_going = await promptToContinue();
    if (keep_going.continue === "No") break;
  }
};


 
export { promptUser };
