import store from '../../src/app/Reducers';
import EventActions from '../../src/app/actions/EventActions';

describe('event actions', () => {
  it('should set events state to fetched events', () => {
    const events = [{ id: 0 }, { id: 1 }];
    EventActions.setEvents(events);
    const newState = store.getState();
    expect(newState.events[0].id).toBe(0);
    expect(newState.events[1].id).toBe(1);
  });

  it('should add new event to events state', () => {
    const event = [{ id: 2 }];
    EventActions.addToEvents(event);
    const newState = store.getState();
    expect(newState.events[2].id).toBe(2);
  });

  it('should update events with edited event', () => {
    const event = { id: 2, name: 'event2' };
    EventActions.updateEvents(event);
    const newState = store.getState();
    expect(newState.events[2].name).toBe('event2');
  });

  it('should remove deleted event from events state', () => {
    EventActions.deleteFromEvents({ id: 1 });
    const newState = store.getState();
    expect(newState.events[1].name).toBe('event2');
  });

  it('should set event state to selected event', () => {
    EventActions.setEvent({ id: 1 });
    const newState = store.getState();
    expect(newState.event.id).toBe(1);
  });
});
