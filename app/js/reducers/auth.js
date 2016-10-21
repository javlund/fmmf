const initialState = {loggedIn: false, loading: false, token: null};

function auth(state = initialState, action) {
  switch(action.type) {
    case 'auth.login': {
      return Object.assign({}, state, {loggedIn: true, loading: false, token: action.token});
    }
    case 'auth.loading': {
      return Object.assign({}, state, {loggedIn: false, loading: true, token: null});
    }
    case 'auth.logout': {
      return Object.assign({}, state, {loggedIn: false, loading: false, token: null});
    }
    case 'auth.setAdminPage': {
      return Object.assign({}, state, {isAdminPage: action.isAdminPage});
    }
    default: {
      return state;
    }
  }
}

export default auth;
