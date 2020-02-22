import Actions from "../actions/actions";
import clienteDAO from "../../DAO/clienteDAO";

const initialState = {
    profissionais: [],
}

const ProfissionaisReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case Actions.setProfissionais:
            return {...state, profissionais: payload};
        default:
            return state;
    }
}

export default ProfissionaisReducer;