import Actions from "../actions/actions";

const initialState = {
    administradores: [],
}

const AdministradoresReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case Actions.setAdministrativo:
            return {...state, administradores: payload};
        default:
            return state;
    }
}

export default AdministradoresReducer;