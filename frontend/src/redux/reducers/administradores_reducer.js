import Actions from "../actions/actions";

const initialState = {
    administradores: [],
    administradorSelected: {},
}

const AdministradoresReducer = (state = initialState, {type, payload}) => {
    switch (type) {
        case Actions.setAdministrativo:
            return {...state, administradores: payload};
        case Actions.selectAdministrador:
            return {...state, administradorSelected: payload};
        default:
            return state;
    }
}

export default AdministradoresReducer;