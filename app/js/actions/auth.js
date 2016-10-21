import {browserHistory} from 'react-router';
import promiseWindow from 'promise-window';

function getToken() {
  return dispatch => {
    const token = localStorage.getItem('token');
    if(token) {
      dispatch({type: 'auth.login', token: token});
    }    
  };
}

function login() {
  return dispatch => {
    const token = localStorage.getItem('token');
    if(token) {
      dispatch({type: 'auth.login', token: token});
      return Promise.resolve(token);
    }
    dispatch({type: 'auth.loading'});
    return promiseWindow.open('/facebook')
      .catch(() => {
        const token = localStorage.getItem('token');
        dispatch({type: 'auth.login', token: token});
        return token;
      });    
  };
}

function logout() {
  return dispatch => {
    localStorage.clear();
    browserHistory.push('/');
    dispatch({type: 'auth.logout'});    
  };
}

function setAdminPage(isAdminPage) {
  return dispatch => {
    dispatch({type: 'auth.setAdminPage', isAdminPage: isAdminPage});
  };
}

export {getToken, login, logout, setAdminPage};
