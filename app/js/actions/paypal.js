import 'whatwg-fetch';

function loadPaypalConfig() {
  return dispatch => {
    dispatch({type: 'paypal.loading'});
    fetch('/paypal-config')
      .then(response => {
        if(!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(r => r.json())
      .then(response => {
        dispatch({type: 'paypal.loaded', data: response});
      })
      .catch(err => {
        dispatch({type: 'paypal.error', error: err});
      });
  };
}

export {
  loadPaypalConfig
};