import { AppStore } from '../src/app/components/StoreComponent';

const { expect } = global;
const appStore = new AppStore();

describe('Store Reducers', () => {
  describe('pageState Reducer', () => {
    const state = appStore.pageState;
    const setPage = (userOnSignInPage, userOnSignUpPage) => {
      return { userOnSignInPage, userOnSignUpPage };
    };
    it('should reflect user is neither on sign in page nor sign up page', () => {
      const action = {
        type: 'BAD_TYPE',
        payload: setPage(true, false),
      };
      expect(appStore.pageReducer(state, action)).to.eql(setPage(false, false));
    });

    it('should reflect user is neither on sign in page nor sign up page', () => {
      const action = {
        type: 'UPDATE_PAGE_STATE',
        payload: setPage(true, true),
      };
      expect(appStore.pageReducer(state, action)).to.eql(setPage(false, false));
    });

    it('should reflect user is on sign in page', () => {
      const action = {
        type: 'UPDATE_PAGE_STATE',
        payload: setPage(true, false),
      };
      expect(appStore.pageReducer(state, action)).to.eql(setPage(true, false));
    });

    it('should reflect user is on sign up page', () => {
      const action = {
        type: 'UPDATE_PAGE_STATE',
        payload: setPage(false, true),
      };
      expect(appStore.pageReducer(state, action)).to.eql(setPage(false, true));
    });
  });

  describe('centerTypes Reducer', () => {
    const state = appStore.centerTypes;
    it('should return array containing all center types', () => {
      expect(appStore.typesReducer(state)).to.include.members(['Anniversary', 'Wedding', 'Birthday', 'Meeting', 'Conference', 'Seminar', 'Summit', 'Funeral', 'Others']);
    });
  });

  describe('facilities Reducer', () => {
    const state = appStore.facilities;
    it('should return array containing all center facilities', () => {
      expect(appStore.facilitiesReducer(state)).to.include.members(['Tables', 'Chairs', 'Stage', 'Power Supply', 'Air Condition', 'Lighting', 'Parking Space', 'Dressing Room', 'Sound System', 'Projector']);
    });
  });

  describe('events Reducer', () => {
    let state = appStore.eventsState;
    it('should set the events state', () => {
      const payload = [
        { id: 1, name: 'mock1' },
        { id: 0, name: 'mock0' },
      ];
      const action = {
        type: 'UPDATE_EVENTS_STATE',
        payload,
      };
      state = appStore.eventsReducer(state, action);
      expect(state[0]).to.eql({ id: 1, name: 'mock1' });
      expect(state[1]).to.eql({ id: 0, name: 'mock0' });
    });

    it('should add to events state', () => {
      const payload = { id: 2, name: 'mock2' };
      const action = {
        type: 'ADD_TO_EVENTS_STATE',
        payload,
      };
      state = appStore.eventsReducer(state, action);
      expect(state[0]).to.eql({ id: 2, name: 'mock2' });
      expect(state[2]).to.eql({ id: 0, name: 'mock0' });
    });

    it('should edit events state', () => {
      const payload = { id: 1, name: 'mockEvent1' };
      const action = {
        type: 'EDIT_EVENTS_STATE',
        payload,
      };
      state = appStore.eventsReducer(state, action);
      expect(state[0]).to.eql({ id: 2, name: 'mock2' });
      expect(state[1]).to.eql({ id: 1, name: 'mockEvent1' });
      expect(state[2]).to.eql({ id: 0, name: 'mock0' });
    });

    it('should delete from events state', () => {
      const action = {
        type: 'DELETE_FROM_EVENTS_STATE',
        payload: { id: 1, name: 'mockEvent1' },
      };
      state = appStore.eventsReducer(state, action);
      expect(state.length).equal(2);
      expect(state[0]).to.eql({ id: 2, name: 'mock2' });
      expect(state[1]).to.eql({ id: 0, name: 'mock0' });
    });
  });

  describe('event state Reducer', () => {
    const state = appStore.eventState;
    it('initial event state should be null', () => {
      expect(state).equal(null);
    });

    it('should set event state', () => {
      const action = {
        type: 'UPDATE_EVENT_STATE',
        payload: { id: 1, name: 'mock1' },
      };
      expect(appStore.eventReducer(state, action)).eql({ id: 1, name: 'mock1' });
    });
  });

  describe('selected Images Reducer', () => {
    const state = appStore.selectedImages;
    it('initial state should have no selected images', () => {
      expect(state.length).equal(0);
    });

    it('should set selected images', () => {
      const action = {
        type: 'UPDATE_SELECTED_IMAGES',
        payload: ['IMAGE1', 'IMAGE2', 'IMAGE3', 'IMAGE4'],
      };
      expect(appStore.imagesReducer(state, action)).to.include.members(['IMAGE1', 'IMAGE2', 'IMAGE3', 'IMAGE4']);
    });
  });

  describe('centers Reducer', () => {
    let state = appStore.centersState;
    it('should set the centers state', () => {
      const payload = [
        { id: 1, name: 'mock1' },
        { id: 0, name: 'mock0' },
      ];
      const action = {
        type: 'UPDATE_CENTERS_STATE',
        payload,
      };
      state = appStore.centersReducer(state, action);
      expect(state[0]).to.eql({ id: 1, name: 'mock1' });
      expect(state[1]).to.eql({ id: 0, name: 'mock0' });
    });

    it('should add to centers state', () => {
      const payload = { id: 2, name: 'mock2' };
      const action = {
        type: 'ADD_TO_CENTERS_STATE',
        payload,
      };
      state = appStore.centersReducer(state, action);
      expect(state[0]).to.eql({ id: 2, name: 'mock2' });
      expect(state[2]).to.eql({ id: 0, name: 'mock0' });
    });

    it('should edit centers state', () => {
      const payload = {
        center: { id: 1, name: 'mockCenter1' },
        index: 1,
      };
      const action = {
        type: 'EDIT_CENTERS_STATE',
        payload,
      };
      state = appStore.centersReducer(state, action);
      expect(state[0]).to.eql({ id: 2, name: 'mock2' });
      expect(state[1]).to.eql({ id: 1, name: 'mockCenter1' });
      expect(state[2]).to.eql({ id: 0, name: 'mock0' });
    });
  });

  describe('center index Reducer', () => {
    const state = appStore.centerState;
    it('initial state index should be null', () => {
      expect(state).equal(null);
    });

    it('should set center state', () => {
      const action = {
        type: 'UPDATE_CENTER_STATE',
        payload: { id: 0, name: 'mockCenter0' },
      };
      expect(appStore.centerReducer(state, action)).to.eql({ id: 0, name: 'mockCenter0' });
    });
  });

  describe('center search Reducer', () => {
    let state = appStore.centerSearch;

    it('should set center search result', () => {
      const action = {
        type: 'UPDATE_CENTER_SEARCH',
        payload: [
          { id: 0, name: 'mockCenter0' },
          { id: 1, name: 'mockCenter1' },
        ],
      };
      state = appStore.centerSearchReducer(state, action);
      expect(state[0]).to.eql({ id: 0, name: 'mockCenter0' });
      expect(state[1]).to.eql({ id: 1, name: 'mockCenter1' });
    });
  });

  describe('center filter Reducer', () => {
    const state = appStore.centerFilter;

    it('should set center filter', () => {
      const action = {
        type: 'UPDATE_CENTER_FILTER',
        payload: 'new search',
      };
      expect(appStore.centerFilterReducer(state, action)).equal('new search');
    });
  });

  describe('alert Reducer', () => {
    const state = appStore.alertState;

    it('should set alert state', () => {
      const action = {
        type: 'UPDATE_ALERT_STATE',
        payload: 'ALERT!!!',
      };
      expect(appStore.alertReducer(state, action)).equal('ALERT!!!');
    });
  });
});
