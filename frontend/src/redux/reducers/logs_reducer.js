import Actions from "../actions/actions";

const initialState = {
    logs: [],
};

const LogsReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case Actions.setLogs:
            return {...state, logs: payload};
        default:
            return state;
    }
}

export default LogsReducer;