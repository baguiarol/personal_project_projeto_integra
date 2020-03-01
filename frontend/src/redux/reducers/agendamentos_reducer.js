import Actions from "../actions/actions";

const initialState = {
    salaSelected: {},
    agendamentos: [],
};

const AgendamentosReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case Actions.selectSala:
            return {...state, salaSelected: payload};
        case Actions.setAgendamentos:
            return {...state, agendamentos: payload};
        default:
            return state;
    }
};

export default AgendamentosReducer;