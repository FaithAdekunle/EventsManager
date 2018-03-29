class AppState {
  constructor() {
    const storage = JSON.parse(localStorage.getItem('eventsManager'));
    this.token = storage ? storage.appToken : null;
    this.pageState = {
      userOnSignInPage: false,
      userOnSignUpPage: false,
    };
    this.centersPageLimit = 15;
    this.centersState = [];
    this.centerState = null;
    this.centerSearch = [];
    this.centerFilter = '';
    this.eventsState = [];
    this.selectedImages = [];
    this.alertState = null;
    this.eventState = null;
  }
}

module.exports = new AppState();
