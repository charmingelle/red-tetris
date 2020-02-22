import { createStore } from 'redux';
import { commonReducer } from './reducers';

export const store = createStore(commonReducer);

export default store;
