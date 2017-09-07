import {createStore, applyMiddleware} from 'redux';
import user_reducer from './ducks/user_reducer';
import promiseMiddleware from 'redux-promise-middleware';

//promiseMiddleware and applyMiddleware are needed to handle asyncronous axios calls to db

export default createStore(user_reducer, {}, applyMiddleware(promiseMiddleware()));