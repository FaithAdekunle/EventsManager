import store from '../../src/app/Reducers';
import OtherActions from '../../src/app/actions/OtherActions';

describe('other actions', () => {
  it('should set token state to received token', () => {
    OtherActions.setToken('token');
    expect(store.getState().token).toBe('token');
  });

  it('should remove token state on signout', () => {
    OtherActions.removeToken('token');
    expect(store.getState().token).toBe(null);
  });

  it('should set alert state to alert user', () => {
    OtherActions.setAlert('alert');
    expect(store.getState().alert).toBe('alert');
  });

  it('should set images state to fetched images', () => {
    OtherActions.setImages(['image']);
    expect(store.getState().images[0]).toBe('image');
  });

  it('should set pagination metadata to received pagination metadata', () => {
    OtherActions.setPagination('pagination');
    expect(store.getState().paginationMetadata).toBe('pagination');
  });
});
