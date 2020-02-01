import {createStore, combineReducers} from 'redux';
import GeneralReducer from "./reducers/general_reducer";

const Store = createStore(combineReducers({
    general: GeneralReducer,
}));

export default Store;