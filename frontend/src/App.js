import React from 'react';
import './App.css';
import { Stitch, RemoteMongoClient, AnonymousCredential} from 'mongodb-stitch-browser-sdk';
import {Provider} from 'react-redux';
import Store from "./redux/store";
import Actions from "./redux/actions/actions";
import {HashRouter as Router, Route} from 'react-router-dom';
import LoginPage from "./pages/login";

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
          </Router>
      </Provider>
  );
}

export default App;
