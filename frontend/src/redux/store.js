import {createStore, combineReducers, applyMiddleware} from 'redux';
import GeneralReducer from "./reducers/general_reducer";
import ProfissionaisReducer from "./reducers/profissionais_reducer";
import thunk from "redux-thunk";
import AdministradoresReducer from "./reducers/administradores_reducer";
import SalasReducer from "./reducers/salas_reducer";

const Store = createStore(combineReducers({
    general: GeneralReducer,
    profissionais: ProfissionaisReducer,
    administradores: AdministradoresReducer,
    salas: SalasReducer,
}, applyMiddleware(thunk)));

export default Store;