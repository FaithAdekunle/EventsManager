import store from '../../src/app/Reducers';
import OtherActions from '../../src/app/actions/otherActions';

describe('other actions', () => {
  test('set token', () => {
    OtherActions.setToken('token');
    expect(store.getState().token).toBe('token');
  });

  test('remove token', () => {
    OtherActions.removeToken('token');
    expect(store.getState().token).toBe(null);
  });

  test('set alert', () => {
    OtherActions.setAlert('alert');
    expect(store.getState().alert).toBe('alert');
  });

  test('set images', () => {
    OtherActions.setImages(['image']);
    expect(store.getState().images[0]).toBe('image');
  });

  test('set pagination', () => {
    OtherActions.setPagination('pagination');
    expect(store.getState().paginationMetadata).toBe('pagination');
  });
});
