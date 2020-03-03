import Actions from "../actions/actions";

const initialState = {
    profissionais: [],
    profissionalSelected: {},
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
        default:
            return state;
    }
}

export default ProfissionaisReducer;