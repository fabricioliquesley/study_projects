class GameService {
  constructor({ gameRepository }) {
    this.gameRepository = gameRepository;
  }

  async find(itemId) {
    return this.gameRepository.find(itemId);
  }

  async create(data) {
    return this.gameRepository.create(data);
  }
}

module.exports = GameService;