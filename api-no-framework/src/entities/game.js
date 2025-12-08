class Game {
  constructor({ name, publisher, release_year }) {
    this.id = Math.floor(Math.random() * 100) + Date.now();
    this.name = name;
    this.publisher = publisher;
    this.release_year = release_year;
  }

  isValid() {
    const propertyNames = Object.getOwnPropertyNames(this);
    const amountInvalid = propertyNames
      .map(property => !!this[property] ? null : `${property} is missing!`)
      .filter(item => !!item);

    return {
      valid: amountInvalid.length === 0,
      error: amountInvalid
    }
  }
}

module.exports = Game;