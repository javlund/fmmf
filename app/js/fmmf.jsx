import React from 'react';
import {render} from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import reducers from './reducers';
import App from './components/app';


import 'bootstrap/dist/css/bootstrap.css';
import '../css/fmmf.css';

const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));

render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('app')
);
