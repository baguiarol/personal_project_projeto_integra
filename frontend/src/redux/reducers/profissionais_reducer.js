import Actions from "../actions/actions";

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