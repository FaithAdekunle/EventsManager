import { createStore, combineReducers } from 'redux';

class AppStore {
  constructor() {
    this.pageState = {
      userOnSignInPage: false,
      userOnSignUpPage: false,
    };
    this.centerTypes = [
      'Anniversary',
      'Birthday',
      'Wedding',
      'Meeting',
      'Conference',
      'Seminar',
      'Summit',
      'Funeral',
      'Others',
    ];
    this.facilities = [
      'Tables',
      'Chairs',
      'Stage',
      'Power Supply',
      'Air Condition',
      'Lighting',
      'Parking Space',
      'Dressing Room',
      'Sound System',
      'Projector',
    ];
    this.centersState = [];
    this.centerState = null;
    this.centerSearch = [];
    this.centerFilter = '';
    this.eventsState = [];
    this.selectedImages = [];
    this.alertState = null;
    this.eventState = null;
    this.pageReducer = this.pageReducer.bind(this);
    this.alertReducer = this.alertReducer.bind(this);
    this.eventsReducer = this.eventsReducer.bind(this);
    this.centersReducer = this.centersReducer.bind(this);
    this.centerSearchReducer = this.centerSearchReducer.bind(this);
    this.centerFilterReducer = this.centerFilterReducer.bind(this);
    this.centerReducer = this.centerReducer.bind(this);
    this.eventReducer = this.eventReducer.bind(this);
    this.typesReducer = this.typesReducer.bind(this);
    this.facilitiesReducer = this.facilitiesReducer.bind(this);
    this.imagesReducer = this.imagesReducer.bind(this);
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

  typesReducer(state = this.centerTypes) {
    return state;
  }

  facilitiesReducer(state = this.facilities) {
    return state;
  }

  eventsReducer(state = this.eventsState, action) {
    switch (action.type) {
      case 'UPDATE_EVENTS_STATE':
        return action.payload;
      case 'ADD_TO_EVENTS_STATE':
        return [
          action.payload,
          ...state,
        ];
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

  eventReducer(state = this.eventState, action) {
    switch (action.type) {
      case 'UPDATE_EVENT_STATE':
        return action.payload;
      default:
        return state;
    }
  }

  imagesReducer(state = this.selectedImages, action) {
    switch (action.type) {
      case 'UPDATE_SELECTED_IMAGES':
        return action.payload;
      default:
        return state;
    }
  }

  centersReducer(state = this.centersState, action) {
    switch (action.type) {
      case 'UPDATE_CENTERS_STATE':
        return action.payload;
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
      default:
        return state;
    }
  }

  centerReducer(state = this.centerState, action) {
    switch (action.type) {
      case 'UPDATE_CENTER_STATE':
        return action.payload;
      default:
        return state;
    }
  }

  centerSearchReducer(state = this.centerSearch, action) {
    switch (action.type) {
      case 'UPDATE_CENTER_SEARCH':
        return [...action.payload];
      default:
        return state;
    }
  }

  centerFilterReducer(state = this.centerFilter, action) {
    switch (action.type) {
      case 'UPDATE_CENTER_FILTER':
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
}

const appStore = new AppStore();
const store = createStore(combineReducers({
  pageState: appStore.pageReducer,
  eventsState: appStore.eventsReducer,
  centersState: appStore.centersReducer,
  centerState: appStore.centerReducer,
  centerSearch: appStore.centerSearchReducer,
  centerFilter: appStore.centerFilterReducer,
  eventState: appStore.eventReducer,
  alertState: appStore.alertReducer,
  centerTypes: appStore.typesReducer,
  centerFacilities: appStore.facilitiesReducer,
  selectedImages: appStore.imagesReducer,
}));
module.exports = { store, AppStore };
