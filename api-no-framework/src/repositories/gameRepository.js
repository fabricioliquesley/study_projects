const  { readFile, writeFile } = require("node:fs/promises");

class GameRepository {
  constructor ({ file }) {
    this.file = file;
  }

  async _currentFileContent() {
    return JSON.parse(await readFile(this.file));
  }

  async find(itemId) {
    const all = await this._currentFileContent();
    
    if (!itemId) return all;

    return all.find(({ id }) => itemId === id);
  }

  async create(data) {
    const currentFile = await this._currentFileContent();

    currentFile.push(data);

    await writeFile(this.file, JSON.stringify(currentFile));

    return data.id;
  }
}

module.exports = GameRepository;

// const gameRepository = new GameRepository({
//   file: "../database/data.json"
// })

// await gameRepository
//   .create({
//     name: "God of War",
//     publisher: "Sony",
//     release_year: 2018
//   })
//   .then(console.log)
//   .catch((error) => console.log("error", error))

// gameRepository
//   .find()
//   .then(console.log)
//   .catch((error) => console.log("error", error)) 
