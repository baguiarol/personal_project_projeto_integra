import {createStore, combineReducers, applyMiddleware} from 'redux';
import GeneralReducer from "./reducers/general_reducer";
import ProfissionaisReducer from "./reducers/profissionais_reducer";
import thunk from "redux-thunk";

const Store = createStore(combineReducers({
    general: GeneralReducer,
    profissionais: ProfissionaisReducer,
}, applyMiddleware(thunk)));

export default Store;