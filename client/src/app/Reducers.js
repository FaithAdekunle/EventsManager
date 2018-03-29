import { createStore, combineReducers } from 'redux';
import Helpers from './Helpers';
import appState from './StoreComponent';

class Reducers {
  constructor(state) {
    this.state = state;
    this.tokenReducer = this.tokenReducer.bind(this);
    this.limitReducer = this.limitReducer.bind(this);
    this.pageReducer = this.pageReducer.bind(this);
    this.alertReducer = this.alertReducer.bind(this);
    this.eventsReducer = this.eventsReducer.bind(this);
    this.centersReducer = this.centersReducer.bind(this);
    this.centerSearchReducer = this.centerSearchReducer.bind(this);
    this.centerFilterReducer = this.centerFilterReducer.bind(this);
    this.centerReducer = this.centerReducer.bind(this);
    this.eventReducer = this.eventReducer.bind(this);
    this.imagesReducer = this.imagesReducer.bind(this);
  }

  tokenReducer(state = this.state.token, action) {
    switch (action.type) {
      case 'UPDATE_TOKEN':
        const eventsManager = {
          appToken: action.payload,
        };
        localStorage.setItem('eventsManager', JSON.stringify(eventsManager));
        return action.payload;
      case 'REMOVE_TOKEN':
        localStorage.removeItem('eventsManager');
        return null;
      default:
        return state;
    }
  }

  limitReducer(state = this.state.centersPageLimit, action) {
    switch (action.type) {
      case 'UPDATE_CENTERS_PAGE_LIMIT':
        return state + 15;
      case 'RESET_CENTERS_PAGE_LIMIT':
        return 15;
      default:
        return state;
    }
  }

  pageReducer(state = this.state.pageState, action) {
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

  eventsReducer(state = this.state.eventsState, action) {
    switch (action.type) {
      case 'UPDATE_EVENTS_STATE':
        return Helpers.sortByDate(action.payload);
      case 'ADD_TO_EVENTS_STATE':
        return Helpers.sortByDate([
          action.payload,
          ...state,
        ]);
      case 'EDIT_EVENTS_STATE':
        return state.map((event) => {
          if (event.id === action.payload.id) return action.payload;
          return event;
        });
      case 'DELETE_FROM_EVENTS_STATE':
        const index = state.findIndex(event => event.id === action.payload.id);
        return [
          ...state.slice(0, index),
          ...state.slice(index + 1, state.length),
        ];
      default:
        return state;
    }
  }

  eventReducer(state = this.state.eventState, action) {
    switch (action.type) {
      case 'UPDATE_EVENT_STATE':
        return action.payload;
      default:
        return state;
    }
  }

  imagesReducer(state = this.state.selectedImages, action) {
    switch (action.type) {
      case 'UPDATE_SELECTED_IMAGES':
        return action.payload;
      default:
        return state;
    }
  }

  centersReducer(state = this.state.centersState, action) {
    switch (action.type) {
      case 'UPDATE_CENTERS_STATE':
        return Helpers.sortByName(action.payload);
      case 'ADD_TO_CENTERS_STATE':
        return Helpers.sortByName([
          action.payload,
          ...state,
        ]);
      case 'EDIT_CENTERS_STATE':
        return [
          ...state.slice(0, action.payload.index),
          action.payload.center,
          ...state.slice(action.payload.index + 1, state.length),
        ];
      default:
        return state;
    }
  }

  centerReducer(state = this.state.centerState, action) {
    switch (action.type) {
      case 'UPDATE_CENTER_STATE':
        return action.payload;
      default:
        return state;
    }
  }

  centerSearchReducer(state = this.state.centerSearch, action) {
    switch (action.type) {
      case 'UPDATE_CENTER_SEARCH':
        return [...action.payload];
      default:
        return state;
    }
  }

  centerFilterReducer(state = this.state.centerFilter, action) {
    switch (action.type) {
      case 'UPDATE_CENTER_FILTER':
        return action.payload;
      default:
        return state;
    }
  }

  alertReducer(state = this.state.alertState, action) {
    switch (action.type) {
      case 'UPDATE_ALERT_STATE':
        return action.payload;
      default:
        return state;
    }
  }
}

const appStore = new Reducers(appState);
const store = createStore(combineReducers({
  token: appStore.tokenReducer,
  limit: appStore.limitReducer,
  pageState: appStore.pageReducer,
  eventsState: appStore.eventsReducer,
  centersState: appStore.centersReducer,
  centerState: appStore.centerReducer,
  centerSearch: appStore.centerSearchReducer,
  centerFilter: appStore.centerFilterReducer,
  eventState: appStore.eventReducer,
  alertState: appStore.alertReducer,
  selectedImages: appStore.imagesReducer,
}));
module.exports = store;
