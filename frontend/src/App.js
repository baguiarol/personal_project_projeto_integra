import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Stitch, RemoteMongoClient, AnonymousCredential} from 'mongodb-stitch-browser-sdk';
import AdministradorDAO from './DAO/administradorDAO';
import {Provider} from 'react-redux';
function App() {

    React.useEffect(() => {
        const client = Stitch.initializeDefaultAppClient('integra-rhnuz');

        const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('Integra');

        client.auth.loginWithCredential(new AnonymousCredential())
            .then(async user => {
                // Teste seu código aqui
            })
            .catch(err => {
               console.log(err);
            });
    }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
