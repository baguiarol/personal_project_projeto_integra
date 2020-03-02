import Actions from "../actions/actions";

const initialState = {
    salas: [],
    salaSelected: {},
}

const SalasReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case Actions.setSalas:
            return {...state, salas: payload};
        case Actions.selectSala:
            return {...state, salaSelected: payload};
        default:
            return state;
    }
}

export default SalasReducer;