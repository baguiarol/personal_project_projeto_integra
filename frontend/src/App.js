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

function App() {

    React.useEffect(() => {
        //Inicializa o Banco de Dados.
        const client = Stitch.initializeDefaultAppClient('integra-rhnuz');
        const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('Integra');

        //Coloca ambos dentro da Store.
        Store.dispatch({type: Actions.setMongoClient, payload: client});
        Store.dispatch({type: Actions.setDatabase, payload: db});
    }, []);

  return (
      <Provider store={Store}>
          <Router>
              <Route path={'/'} exact={true} component={LoginPage} />
              <Route path={'/agendamentos'} component={ClienteAgendamentos} />
              <Route path={'/minhas_reservas'} component={MinhasReservasPage} />
              <Route path={'/agendamento_adm'} component={AgendamentosAdministrador} />
          </Router>
      </Provider>
  );
}

export default App;
