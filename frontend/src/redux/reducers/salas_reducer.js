import Actions from "../actions/actions";

const initialState = {
    salas: [],
}

const SalasReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case Actions.setSalas:
            return {...state, salas: payload};
        default:
            return state;
    }
}

export default SalasReducer;