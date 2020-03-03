import React from 'react';
import './App.css';
import { Stitch, RemoteMongoClient} from 'mongodb-stitch-browser-sdk';
import {Provider} from 'react-redux';
import Store from "./redux/store";
import Actions from "./redux/actions/actions";
import {HashRouter as Router, Route} from 'react-router-dom';
import LoginPage from "./pages/login";
import ClienteAgendamentos from "./pages/cliente/agendamentos";
import "@fortawesome/fontawesome-free/css/all.css";
import MinhasReservasPage from "./pages/cliente/reservas";
import AgendamentosAdministrador from "./pages/administrador/agendamentos";
import DashboardPage from "./pages/administrador/dashboard";
import LogsPage from "./pages/administrador/logs";
import ProfissionaisPage from "./pages/administrador/profissionais";
import AdministrativoPage from "./pages/administrador/administrativo";
import SalasPage from "./pages/administrador/salas";
import clienteDAO from "./DAO/clienteDAO";
import administradorDAO from "./DAO/administradorDAO";
import salaDAO from "./DAO/salaDAO";
import reservaDAO from "./DAO/reservaDAO";
import logDAO from "./DAO/logDAO";

function App() {

    const setDatabaseIntoDAOs = (db) => {
        clienteDAO.setDb(db);
        administradorDAO.setDb(db);
        salaDAO.setDb(db);
        reservaDAO.setDb(db);
        logDAO.setDb(db);
    }

    React.useEffect(() => {
        //Inicializa o Banco de Dados.
        const client = Stitch.initializeDefaultAppClient('integra-rhnuz');
        const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('Integra');

        //Coloca ambos dentro da Store.
        Store.dispatch({type: Actions.setMongoClient, payload: client});
        Store.dispatch({type: Actions.setDatabase, payload: db});

        setDatabaseIntoDAOs(db);
    }, []);

  return (
      <Provider store={Store}>
          <Router>
              <Route path={'/'} exact={true} component={LoginPage} />
              <Route path={'/agendamentos'} component={ClienteAgendamentos} />
              <Route path={'/minhas_reservas'} component={MinhasReservasPage} />
              <Route path={'/agendamento_adm'} component={AgendamentosAdministrador} />
              <Route path={'/dashboard'} component={DashboardPage} />
              <Route path={'/administrativo'} component={AdministrativoPage} />
              <Route path={'/profissionais'} component={ProfissionaisPage} />
              <Route path={'/salas'} component={SalasPage} />
              <Route path={'/logs'} component={LogsPage} />
          </Router>
      </Provider>
  );
}

export default App;
