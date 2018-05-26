import store from '../../src/app/Reducers';
import EventActions from '../../src/app/actions/eventActions';

describe('event actions', () => {
  test('set events', () => {
    const events = [{ id: 0 }, { id: 1 }];
    EventActions.setEvents(events);
    const newState = store.getState();
    expect(newState.events[0].id).toBe(0);
    expect(newState.events[1].id).toBe(1);
  });

  test('add to events', () => {
    const event = [{ id: 2 }];
    EventActions.addToEvents(event);
    const newState = store.getState();
    expect(newState.events[2].id).toBe(2);
  });

  test('update events', () => {
    const event = { id: 2, name: 'event2' };
    EventActions.updateEvents(event);
    const newState = store.getState();
    expect(newState.events[2].name).toBe('event2');
  });

  test('delete from events', () => {
    EventActions.deleteFromEvents({ id: 1 });
    const newState = store.getState();
    expect(newState.events[1].name).toBe('event2');
  });

  test('set event', () => {
    EventActions.setEvent({ id: 1 });
    const newState = store.getState();
    expect(newState.event.id).toBe(1);
  });
});
