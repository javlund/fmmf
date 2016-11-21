const initialState = {};

function paypal(state = initialState, action) {
  switch(action.type) {
    case 'paypal.loading': {
      return {...state, loading: true};
    }
    case 'paypal.loaded': {
      return {...state, loading: false, ...action.data};
    }
    case 'paypal.error': {
      return {...state, loading: false, ...action.error};
    }
    default: {
      return state;
    }
  }
}

export default paypal;