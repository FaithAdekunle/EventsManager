import { createStore, combineReducers } from 'redux';

class AppStore {
  constructor() {
    const eventsManager = JSON.parse(localStorage.getItem('eventsManager')) || {};
    this.loginState = eventsManager.loginState || {
      userIsSignedIn: false,
      userIsAdmin: false,
    };
    this.pageState = {
      userOnSignInPage: false,
      userOnSignUpPage: false,
    };
    this.userState = eventsManager.userState || {
      fullname: null,
      email: null,
    };
    this.centerTypes = [
      'Anniversary',
      'Birthday',
      'Wedding',
      'Meeting',
      'conference',
      'Seminar',
      'Summit',
      'Funeral',
      'Others',
    ];
    this.centersState = [];
    this.eventsState = [];
    this.alertState = null;
    this.eventState = null;
    this.pageReducer = this.pageReducer.bind(this);
    this.userReducer = this.userReducer.bind(this);
    this.loginReducer = this.loginReducer.bind(this);
    this.alertReducer = this.alertReducer.bind(this);
    this.eventsReducer = this.eventsReducer.bind(this);
    this.centersReducer = this.centersReducer.bind(this);
    this.eventReducer = this.eventReducer.bind(this);
    this.typesReducer = this.typesReducer.bind(this);
  }

  pageReducer(state = this.pageState, action) {
    const newState = {
      ...state,
      ...action.payload,
    };
    switch (action.type) {
      case 'UPDATE_PAGE_STATE':
        if (newState.userOnSignInPage && newState.userOnSignUpPage) return state;
        return newState;
      default:
        return state;
    }
  }

  typesReducer(state = this.centerTypes, action) {
    switch (action.type) {
      case 'UPDATE_TYPES_STATE':
        return state;
      default:
        return state;
    }
  }

  eventsReducer(state = this.eventsState, action) {
    switch (action.type) {
      case 'UPDATE_EVENTS_STATE':
        return action.payload;
      case 'ADD_TO_EVENTS_STATE':
        return [
          ...state,
          action.payload,
        ];
      case 'EDIT_EVENTS_STATE':
        return [
          ...state.slice(0, action.payload.index),
          action.payload.event,
          ...state.slice(action.payload.index, state.length),
        ];
      case 'DELETE_FROM_EVENTS_STATE':
        return [
          ...state.slice(0, action.payload),
          ...state.slice(action.payload + 1, state.length),
        ];
      default:
        return state;
    }
  }

  eventReducer(state = this.eventState, action) {
    switch (action.type) {
      case 'UPDATE_EVENT_STATE':
        return action.payload;
      default:
        return state;
    }
  }

  centersReducer(state = this.centersState, action) {
    switch (action.type) {
      case 'UPDATE_CENTERS_STATE':
        if (Array.isArray(action.payload)) return action.payload;
        return [
          ...state,
          action.payload,
        ];
      default:
        return state;
    }
  }

  userReducer(state = this.userState, action) {
    switch (action.type) {
      case 'UPDATE_USER_STATE':
        return action.payload;
      default:
        return state;
    }
  }

  alertReducer(state = this.alertState, action) {
    switch (action.type) {
      case 'UPDATE_ALERT_STATE':
        return action.payload;
      default:
        return state;
    }
  }

  loginReducer(state = this.loginState, action) {
    switch (action.type) {
      case 'UPDATE_LOGIN_STATE':
        return (!action.payload.userIsSignedIn
          && action.payload.userIsAdmin) ? state : action.payload;
      default:
        return state;
    }
  }
}

const appStore = new AppStore();
const store = createStore(combineReducers({
  pageState: appStore.pageReducer,
  loginState: appStore.loginReducer,
  userState: appStore.userReducer,
  eventsState: appStore.eventsReducer,
  centersState: appStore.centersReducer,
  eventState: appStore.eventReducer,
  alertState: appStore.alertReducer,
  centerTypes: appStore.typesReducer,
}));
export default store;

