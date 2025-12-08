const http = require("node:http");
const PORT = 3000;
const DEFAULT_HEADER = { "Content-Type": "application/json" };
const gameFactory = require("./factories/gameFactory");
const gameService = gameFactory.generateGameService();
const Game = require("./entities/game");

const routes = {
  "/games:get": async (request, response) => {
    const { gameId } = request.queryString;

    const games = await gameService.find(gameId)

    response.write(JSON.stringify(games));
    return response.end();
  },

  "/games:post": async (request, response) => {
    try {
      for await (const data of request) {
        const item = JSON.parse(data);
        const game = new Game(item);
        const { error, valid } = game.isValid();

        if (!valid) {
          response.writeHead(400, DEFAULT_HEADER);
          response.write(JSON.stringify({error: error.join(",")}));
          return response.end();
        }

        const id = await gameService.create(game);

        response.writeHead(201, DEFAULT_HEADER);
        response.write(JSON.stringify({ success: "Game added with success!", id }));
        response.end();
      }
    } catch (error) {
      return errorHandler(response)(error);
    }
  },

  default: async (_request, response) => {
    response.write("Not Found!");
    response.end();
  }
}

const errorHandler = response => {
  return error => {
    console.log("Fail", error);
    response.writeHead(500, DEFAULT_HEADER);
    response.write(JSON.stringify({ error: "Internal server error "}));
    return response.end();
  }
}

const server = (request, response) => {
  const { url, method } = request;
  const [_, route, gameId] = url.split("/");

  request.queryString = { gameId: isNaN(gameId) ? gameId : Number(gameId) };
  const key = `/${route}:${method.toLowerCase()}`;
  
  const chosenRoute = routes[key] || routes.default;
  return chosenRoute(request, response)
    .catch(errorHandler(response));
}

http.createServer(server)
  .listen(PORT, () => console.log("Server running at", PORT));