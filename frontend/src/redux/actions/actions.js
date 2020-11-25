const Actions = {
  setDatabase: 'SET_DATABASE',
  setMongoClient: 'SET_MONGO_CLIENT',
  setUserLogged: 'SET_USER_LOGGED',
  showModal: 'SHOW_MODAL',
  closeModal: 'CLOSE_MODAL',
  setProfissionais: 'SET_PROFISSIONAIS',
  setNotifications: 'SET_NOTIFICATIONS',
  setProfissionaisHash: 'SET_PROFISSIONAIS_HASH',
  setAdministrativo: 'SET_ADMS',
  setSalas: 'SET_SALAS',
  selectDate: 'SELECT_DATE',
  selectSala: 'SELECT_SALA',
  selectAgendamentos: 'SELECT_AGENDAMENTO',
  setAgendamentos: 'SET_AGENDAMENTOS',
  addAgendamento: 'ADD_AGENDAMENTO',
  selectAdministrador: 'SELECT_ADM',
  selectProfissional: 'SELECT_PROF',
  setLogs: 'SET_LOGS',
  setProfissionalReservas: 'SET_PROF_RESERVAS',
  setBloqueiosSalas: 'SET_BLOQ_SALAS',
  setFetchedAgendamentos: 'SET_FETCH',
};

export const ActionsFn = {
  openModal: (open) => ({ type: Actions.showModal, payload: open }),
  closeModal: () => ({ type: Actions.closeModal }),
  setProfissionais: (prof) => ({
    type: Actions.setProfissionais,
    payload: prof,
  }),
  setProfissionaisHash: (hash) => ({
    type: Actions.setProfissionaisHash,
    payload: hash,
  }),
  setSalas: (salas) => ({ type: Actions.setSalas, payload: salas }),
  selectDate: (date) => ({ type: Actions.selectDate, payload: date }),
  setAgendamentos: (agendamentos) => ({
    type: Actions.setAgendamentos,
    payload: agendamentos,
  }),
  setLogs: (logs) => ({ type: Actions.setLogs, payload: logs }),
  setBloqueiosSalas: (bloqueios) => ({
    type: Actions.setBloqueiosSalas,
    payload: bloqueios,
  }),
  setUserLogged: (user) => ({ type: Actions.setUserLogged, payload: user }),
  setProfissionalReservas: (reservas) => ({
    type: Actions.setProfissionalReservas,
    payload: reservas,
  }),
  selectSala: (sala) => ({ type: Actions.selectSala, payload: sala }),
  setAdministrativo: (adms) => ({
    type: Actions.setAdministrativo,
    payload: adms,
  }),
  addAgendamento: (agnd) => ({
    type: Actions.addAgendamento,
    payload: agnd,
  }),
  setNotifications: (notifications) => ({
    type: Actions.setNotifications,
    payload: notifications,
  }),
};

export default Actions;
