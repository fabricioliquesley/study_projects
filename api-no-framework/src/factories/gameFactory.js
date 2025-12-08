const GameRepository = require("../repositories/gameRepository");
const GameService = require("../services/gameService");
const path = require("node:path");

const databasePath = path.join(__dirname, "../../database", "data.json");

const generateGameService = () => {
  const gameRepository = new GameRepository({ file: databasePath });
  const gameService = new GameService({ gameRepository });

  return gameService;
}

module.exports = { generateGameService };

// generateGameService()
//   .find()
//   .then(console.log)
//   .catch(error => console.error(error))
