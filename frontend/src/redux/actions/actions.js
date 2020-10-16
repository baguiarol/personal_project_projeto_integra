const Actions = {
    setDatabase: 'SET_DATABASE',
    setMongoClient: 'SET_MONGO_CLIENT',
    setUserLogged: 'SET_USER_LOGGED',
    SetUserLogged: (user) => ({type: Actions.setUserLogged, payload: user}),
    showModal: 'SHOW_MODAL',
    closeModal: 'CLOSE_MODAL',
    setProfissionais: 'SET_PROFISSIONAIS',
    setProfissionaisHash: 'SET_PROFISSIONAIS_HASH',
    setAdministrativo: 'SET_ADMS',
    setSalas: 'SET_SALAS',
    selectDate: 'SELECT_DATE',
    selectSala: 'SELECT_SALA',
    selectAgendamentos: 'SELECT_AGENDAMENTO',
    setAgendamentos: 'SET_AGENDAMENTOS',
    selectAdministrador: 'SELECT_ADM',
    selectProfissional: 'SELECT_PROF',
    setLogs: 'SET_LOGS',
    setProfissionalReservas: 'SET_PROF_RESERVAS',
    setBloqueiosSalas: 'SET_BLOQ_SALAS',
    setFetchedAgendamentos: 'SET_FETCH',
}

export default Actions;
