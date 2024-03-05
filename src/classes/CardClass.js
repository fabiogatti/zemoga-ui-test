class CardClass {
  constructor(data) {
    this.likes = data.votes.positive;
    this.dislikes = data.votes.negative;
    this.lastUpdated = data.lastUpdated;
    this.picture = data.picture;
    this.category = data.category;
    this.description = data.description;
    this.name = data.name;
  }
}

export { CardClass }