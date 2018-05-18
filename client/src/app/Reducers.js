import { createStore, combineReducers } from 'redux';
import Store from './Store.js';
import constants from './constants';

/**
 * defines class for state reducers
 */
class Reducers {
  /**
   * constructor
   * @param {object} store
   */
  constructor(store) {
    this.store = store;
    this.tokenReducer = this.tokenReducer.bind(this);
    this.alertReducer = this.alertReducer.bind(this);
    this.eventsReducer = this.eventsReducer.bind(this);
    this.centersReducer = this.centersReducer.bind(this);
    this.searchResultsReducer = this.searchResultsReducer.bind(this);
    this.centerReducer = this.centerReducer.bind(this);
    this.eventReducer = this.eventReducer.bind(this);
    this.imagesReducer = this.imagesReducer.bind(this);
    this.paginationMetadataReducer = this.paginationMetadataReducer.bind(this);
  }

  /**
   * reducer for user token state property
   * @param { object } state
   * @param { object } action
   * @returns { string | null } new or old token state property or null
   */
  tokenReducer(state = this.store.token, action) {
    switch (action.type) {
      case constants.SET_TOKEN:
        const eventsManager = {
          appToken: action.payload,
        };
        localStorage.setItem('eventsManager', JSON.stringify(eventsManager));
        return action.payload;
      case constants.REMOVE_TOKEN:
        localStorage.removeItem('eventsManager');
        return null;
      default:
        return state;
    }
  }

  /**
   * reducer for eventsState state property
   * @param { object } state
   * @param { object } action
   * @returns { array } new or old eventsState state property
   */
  eventsReducer(state = this.store.events, action) {
    switch (action.type) {
      case constants.SET_EVENTS:
        return action.payload;
      case constants.ADD_TO_EVENTS:
        return [
          ...state,
          ...action.payload,
        ];
      case constants.UPDATE_EVENTS:
        return state.map((event) => {
          if (event.id === action.payload.id) return action.payload;
          return event;
        });
      case constants.DELETE_FROM_EVENTS:
        const index = state.findIndex(event => event.id === action.payload.id);
        return [
          ...state.slice(0, index),
          ...state.slice(index + 1, state.length),
        ];
      default:
        return state;
    }
  }

  /**
   * reducer for eventState state property
   * @param { object } state
   * @param { object } action
   * @returns { object } new or old eventState state property
   */
  eventReducer(state = this.store.event, action) {
    switch (action.type) {
      case constants.SET_EVENT:
        return action.payload;
      default:
        return state;
    }
  }

  /**
   * reducer for selectedImages state property
   * @param { object } state
   * @param { object } action
   * @returns { array } new or old selectedImages state property
   */
  imagesReducer(state = this.store.images, action) {
    switch (action.type) {
      case constants.SET_IMAGES:
        return action.payload;
      default:
        return state;
    }
  }

  /**
   * reducer for centers state property
   * @param { object } state
   * @param { object } action
   * @returns { array } new or old centerState state property
   */
  centersReducer(state = this.store.centers, action) {
    switch (action.type) {
      case constants.SET_CENTERS:
        return action.payload;
      case constants.ADD_TO_CENTERS:
        return [
          action.payload,
          ...state,
        ];
      default:
        return state;
    }
  }

  /**
   * reducer for centerState state property
   * @param { object } state
   * @param { object } action
   * @returns { object | null } new centerState object or null
   */
  centerReducer(state = this.store.center, action) {
    switch (action.type) {
      case constants.SET_CENTER:
        return action.payload;
      default:
        return state;
    }
  }

  /**
   * reducer for centerSearch state property
   * @param { object } state
   * @param { object } action
   * @returns { object | null } new or old centerSearch state property
   */
  searchResultsReducer(state = this.store.searchResults, action) {
    switch (action.type) {
      case constants.SET_SEARCH_RESULTS:
        return [...action.payload];
      default:
        return state;
    }
  }

  /**
   * reducer for alert state property
   * @param { object } state
   * @param { object } action
   * @returns { string } new or old alertState state property
   */
  alertReducer(state = this.store.alert, action) {
    switch (action.type) {
      case constants.SET_ALERT:
        return action.payload;
      default:
        return state;
    }
  }

  /**
   * reducer for pagination metadata
   * @param { object } state
   * @param { object } action
   * @returns { string } new or old alertState pagination metadata
   */
  paginationMetadataReducer(state = this.store.paginationMetadata, action) {
    switch (action.type) {
      case constants.SET_PAGINATION_METADATA:
        return action.payload;
      default:
        return state;
    }
  }
}

const appStore = new Reducers(Store);
const state = createStore(combineReducers({
  token: appStore.tokenReducer,
  events: appStore.eventsReducer,
  centers: appStore.centersReducer,
  center: appStore.centerReducer,
  searchResults: appStore.searchResultsReducer,
  event: appStore.eventReducer,
  alert: appStore.alertReducer,
  images: appStore.imagesReducer,
  paginationMetadata: appStore.paginationMetadataReducer,
}));
module.exports = state;
