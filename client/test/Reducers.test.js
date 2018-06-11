import { Reducer } from '../src/app/Reducers';
import constants from '../src/app/constants';

const Reducers = new Reducer();

describe('Reducers', () => {
  describe('token reducer', () => {
    let token = null;
    it('should save token in local storage and return new token', () => {
      token = Reducers.tokenReducer(token, {
        type: constants.SET_TOKEN,
        payload: 'token',
      });
      expect(token).toBe('token');
      const storage = JSON.parse(localStorage.getItem('eventsManager'));
      const { appToken } = storage;
      expect(appToken).toBe(token);
    });

    it('should remove token from localStorage and return null', () => {
      token = Reducers.tokenReducer(token, {
        type: constants.REMOVE_TOKEN,
      });
      expect(token).toBe(null);
      expect(localStorage.getItem('eventsManager')).toBe(null);
    });
  });

  describe('events reducer', () => {
    let events = [];
    it('should set events state with fetched events', () => {
      events = Reducers.eventsReducer(events, {
        type: constants.SET_EVENTS,
        payload: [
          { id: 0, name: 'event 0' },
          { id: 1, name: 'event 1' },
          { id: 2, name: 'event 2' },
        ],
      });
      expect(events[0].id).toBe(0);
      expect(events[1].id).toBe(1);
      expect(events[2].id).toBe(2);
    });

    it('should update events state with edited event', () => {
      events = Reducers.eventsReducer(events, {
        type: constants.UPDATE_EVENTS,
        payload: { id: 1, name: 'event one' },
      });
      expect(events[1].name).toBe('event one');
    });

    it('should remove deleted event from events state', () => {
      events = Reducers.eventsReducer(events, {
        type: constants.DELETE_FROM_EVENTS,
        payload: { id: 1, name: 'event one' },
      });
      expect(events[1].id).toBe(2);
    });
  });

  describe('event reducer', () => {
    let event = null;
    it('should set event state to selected event', () => {
      event = Reducers.eventReducer(event, {
        type: constants.SET_EVENT,
        payload: { id: 1, name: 'event one' },
      });
      expect(event.id).toBe(1);
    });
  });

  describe('images reducer', () => {
    let images = [];
    it('should set images state to selected images', () => {
      images = Reducers.imagesReducer(images, {
        type: constants.SET_IMAGES,
        payload: ['image1', 'image2'],
      });
      expect(images.length).toBe(2);
      expect(images[1]).toBe('image2');
    });
  });

  describe('centers reducer', () => {
    let centers = [];
    it('should set centers state to fetched centers', () => {
      centers = Reducers.centersReducer(centers, {
        type: constants.SET_CENTERS,
        payload: [
          { id: 1, name: 'center 1' },
          { id: 2, name: 'center 2' },
        ],
      });
      expect(centers[0].id).toBe(1);
      expect(centers[1].id).toBe(2);
    });

    it('should add new center to centers state', () => {
      centers = Reducers.centersReducer(centers, {
        type: constants.ADD_TO_CENTERS,
        payload: { id: 0, name: 'center 0' },
      });
      expect(centers[0].id).toBe(0);
    });
  });

  describe('center reducer', () => {
    let center = null;
    it('should set center state to selected center', () => {
      center = Reducers.centerReducer(center, {
        type: constants.SET_CENTER,
        payload: { id: 1, name: 'center one' },
      });
      expect(center.id).toBe(1);
    });
  });

  describe('center search results reducer', () => {
    let results = null;
    it('should set results state to results', () => {
      results = Reducers.searchResultsReducer(results, {
        type: constants.SET_SEARCH_RESULTS,
        payload: [
          { id: 1, name: 'center 1' },
          { id: 2, name: 'center 2' },
        ],
      });
      expect(results[0].id).toBe(1);
      expect(results[1].id).toBe(2);
    });
  });

  describe('alert reducer', () => {
    let alert = null;
    it('should set center state to selected center', () => {
      alert = Reducers.alertReducer(alert, {
        type: constants.SET_ALERT,
        payload: 'test passed',
      });
      expect(alert).toBe('test passed');
    });
  });

  describe('pagination metadata reducer', () => {
    let paginationMetadata = null;
    it(
      'should set paginationMetadata state to recieved pagination metadata',
      () => {
        paginationMetadata = Reducers
          .paginationMetadataReducer(paginationMetadata, {
            type: constants.SET_PAGINATION_METADATA,
            payload: {
              total: 50,
            },
          });
        expect(paginationMetadata.total).toBe(50);
      },
    );
  });
});
