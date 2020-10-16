import Actions from "../actions/actions";

const initialState = {
    profissionais: [],
    profissionalSelected: {},
    profissionaisHash: null,
    //para ser usado somente no Cliente
    profissionalReservas: [],
}

const ProfissionaisReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case Actions.setProfissionais:
            return {...state, profissionais: payload};
        case Actions.selectProfissional:
            return {...state, profissionalSelected: payload};
        case Actions.setProfissionalReservas:
            return {...state, profissionalReservas: payload};
        case Actions.setProfissionaisHash:
            return {...state, profissionaisHash: payload};
        default:
            return state;
    }
}

export default ProfissionaisReducer;