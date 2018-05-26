import store from '../../src/app/Reducers';
import CenterActions from '../../src/app/actions/centerActions';

describe('center actions', () => {
  test('set centers', () => {
    CenterActions.setCenters([
      { id: 0 },
      { id: 1 },
    ]);
    const newState = store.getState();
    expect(newState.centers[0].id).toBe(0);
    expect(newState.centers[1].id).toBe(1);
  });

  test('add to centers', () => {
    CenterActions.addToCenters({ id: 2 });
    const newState = store.getState();
    expect(newState.centers[0].id).toBe(2);
  });

  test('set center', () => {
    CenterActions.setCenter({ id: 1, name: 'center' });
    const newState = store.getState();
    expect(newState.center.name).toBe('center');
  });
});
