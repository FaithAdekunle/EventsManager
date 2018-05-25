import state from '../../src/app/Reducers';
import OtherActions from '../../src/app/actions/otherActions';

describe('other actions', () => {
  test('set token', () => {
    OtherActions.setToken('token');
    expect(state.getState().token).toBe('token');
  });

  test('remove token', () => {
    OtherActions.removeToken('token');
    expect(state.getState().token).toBe(null);
  });

  test('set alert', () => {
    OtherActions.setAlert('alert');
    expect(state.getState().alert).toBe('alert');
  });

  test('set images', () => {
    OtherActions.setImages(['image']);
    expect(state.getState().images[0]).toBe('image');
  });

  test('set pagination', () => {
    OtherActions.setPagination('pagination');
    expect(state.getState().paginationMetadata).toBe('pagination');
  });
});
