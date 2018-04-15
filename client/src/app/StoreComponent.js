/**
 * defines class for application state
 */
class AppState {
  /**
   * construtor
   */
  constructor() {
    const storage = JSON.parse(localStorage.getItem('eventsManager'));
    this.token = storage ? storage.appToken : null;
    this.centersState = [];
    this.centerState = null;
    this.centerSearch = [];
    this.eventsState = [];
    this.selectedImages = [];
    this.alertState = null;
    this.eventState = null;
  }
}

module.exports = new AppState();
