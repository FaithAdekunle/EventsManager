import { createStore, combineReducers } from 'redux';
import Helpers from './Helpers';
import appState from './StoreComponent';

/**
 * defines class for state reducers
 */
class Reducers {
  /**
   * constructor
   * @param {object} state
   */
  constructor(state) {
    this.state = state;
    this.tokenReducer = this.tokenReducer.bind(this);
    this.alertReducer = this.alertReducer.bind(this);
    this.eventsReducer = this.eventsReducer.bind(this);
    this.centersReducer = this.centersReducer.bind(this);
    this.centerSearchReducer = this.centerSearchReducer.bind(this);
    this.centerReducer = this.centerReducer.bind(this);
    this.eventReducer = this.eventReducer.bind(this);
    this.imagesReducer = this.imagesReducer.bind(this);
  }

  /**
   * reducer for user token state property
   * @param { object } state
   * @param { object } action
   * @returns { string | null } new or old token state property or null
   */
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

  /**
   * reducer for eventsState state property
   * @param { object } state
   * @param { object } action
   * @returns { array } new or old eventsState state property
   */
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

  /**
   * reducer for eventState state property
   * @param { object } state
   * @param { object } action
   * @returns { object } new or old eventState state property
   */
  eventReducer(state = this.state.eventState, action) {
    switch (action.type) {
      case 'UPDATE_EVENT_STATE':
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
  imagesReducer(state = this.state.selectedImages, action) {
    switch (action.type) {
      case 'UPDATE_SELECTED_IMAGES':
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
  centersReducer(state = this.state.centersState, action) {
    switch (action.type) {
      case 'UPDATE_CENTERS_STATE':
        return [
          ...state,
          ...action.payload,
        ];
      case 'ADD_TO_CENTERS_STATE':
        return [
          action.payload,
          ...state,
        ];
      case 'EDIT_CENTERS_STATE':
        return [
          ...state.slice(0, action.payload.index),
          action.payload.center,
          ...state.slice(action.payload.index + 1, state.length),
        ];
      case 'EMPTY_CENTERS_STATE':
        return [];
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
  centerReducer(state = this.state.centerState, action) {
    switch (action.type) {
      case 'UPDATE_CENTER_STATE':
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
  centerSearchReducer(state = this.state.centerSearch, action) {
    switch (action.type) {
      case 'UPDATE_CENTER_SEARCH':
        return [...action.payload];
      default:
        return state;
    }
  }

  /**
   * reducer for centerFilter state property
   * @param { object } state
   * @param { object } action
   * @returns { string } new or old alertState state property
   */
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
  eventsState: appStore.eventsReducer,
  centersState: appStore.centersReducer,
  centerState: appStore.centerReducer,
  centerSearch: appStore.centerSearchReducer,
  eventState: appStore.eventReducer,
  alertState: appStore.alertReducer,
  selectedImages: appStore.imagesReducer,
}));
module.exports = store;
