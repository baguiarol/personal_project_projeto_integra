import { createStore, combineReducers, applyMiddleware } from 'redux';
import GeneralReducer from './reducers/general_reducer';
import ProfissionaisReducer from './reducers/profissionais_reducer';
import thunk from 'redux-thunk';
import AdministradoresReducer from './reducers/administradores_reducer';
import SalasReducer from './reducers/salas_reducer';
import AgendamentosReducer from './reducers/agendamentos_reducer';
import LogsReducer from './reducers/logs_reducer';
import NotificationReducer from './reducers/notification_reducer';

const Store = createStore(
  combineReducers(
    {
      general: GeneralReducer,
      profissionais: ProfissionaisReducer,
      administradores: AdministradoresReducer,
      salas: SalasReducer,
      agendamentos: AgendamentosReducer,
      logs: LogsReducer,
      notifications: NotificationReducer,
    },
    applyMiddleware(thunk)
  )
);

export default Store;
