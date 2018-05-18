/**
 * defines class for application state
 */
class Store {
  /**
   * construtor
   */
  constructor() {
    const storage = JSON.parse(localStorage.getItem('eventsManager'));
    this.token = storage ? storage.appToken : null;
    this.centers = [];
    this.center = null;
    this.searchResults = [];
    this.events = [];
    this.images = [];
    this.alert = null;
    this.event = null;
    this.paginationMetadata = null;
  }
}

module.exports = new Store();
