import Actions from "../actions/actions";

const initialState = {
    salaSelected: {},
    agendamentos: [],
    agendamentoSelected: {},
    fetchedAgendamentos: false,
};

const AgendamentosReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case Actions.selectSala:
            return {...state, salaSelected: payload};
        case Actions.setAgendamentos:
            return {...state, agendamentos: payload};
        case Actions.selectAgendamentos:
            return {...state, agendamentoSelected: payload};
        case Actions.setFetchedAgendamentos:
            return {...state, fetchedAgendamentos: payload};
        default:
            return state;
    }
};

export default AgendamentosReducer;