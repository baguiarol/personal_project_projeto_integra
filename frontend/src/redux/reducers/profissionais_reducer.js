import Actions from "../actions/actions";

const initialState = {
    profissionais: [],
    profissionalSelected: {},
}

const ProfissionaisReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case Actions.setProfissionais:
            return {...state, profissionais: payload};
        case Actions.selectProfissional:
            return {...state, profissionalSelected: payload};
        default:
            return state;
    }
}

export default ProfissionaisReducer;