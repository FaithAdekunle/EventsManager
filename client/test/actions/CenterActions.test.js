import store from '../../src/app/Reducers';
import CenterActions from '../../src/app/actions/CenterActions';

describe('center actions', () => {
  it('should set centers state to fetched centers', () => {
    CenterActions.setCenters([
      { id: 0 },
      { id: 1 },
    ]);
    const newState = store.getState();
    expect(newState.centers[0].id).toBe(0);
    expect(newState.centers[1].id).toBe(1);
  });

  it('should add new center to centers state', () => {
    CenterActions.addToCenters({ id: 2 });
    const newState = store.getState();
    expect(newState.centers[0].id).toBe(2);
  });

  it('should set center state to fetched center', () => {
    CenterActions.setCenter({ id: 1, name: 'center' });
    const newState = store.getState();
    expect(newState.center.name).toBe('center');
  });
});
