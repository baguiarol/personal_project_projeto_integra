import React from 'react';
import {connect} from "react-redux";
import Actions from "../../redux/actions/actions";
import administradorDAO from "../../DAO/administradorDAO";
import './login.sass';
import InputText from "../../assets/component/inputText/input";
import Button from "../../assets/component/button/button";
import CheckBox from "../../assets/component/checkbox/checkbox";
import {Redirect} from "react-router-dom";
import ModoPaisagem from "../../assets/component/modoPaisagem/modoPaisagem";
import clienteDAO from "../../DAO/clienteDAO";
import { useHistory } from "react-router-dom";

const LoginPage = ({mongoClient, userLogged, setUserLogged}) => {

    const [logged, setLogged] = React.useState(false);
    const [loggedAdm, setLoggedAdm] = React.useState(false);

    return (
        <div className={'login_container'}>
            <ModoPaisagem />
            <div className={'ball'} />
            <div className={'logo_container'}>
                <img
                    alt={'integra_logo'}
                    src={require('../../assets/integra_logo.png')} />
                <p>Sistema de Gerenciamento</p>
            </div>
            <div className={'login'}>
                <h1>Login</h1>
                <div className={'card'}>
                    <form onSubmit={async e => {
                        e.preventDefault();
                        const form = e.target;
                        let clientes = [];
                        clientes = await clienteDAO.find({email: form.email.value});
                        if (clientes.length > 0) {
                            // Login de clientes
                            try {
                                await clienteDAO.login(mongoClient, form.email.value, form.senha.value);
                                alert('Entrar como cliente');
                            } catch (err) {
                                alert(err);
                            }
                        } else {
                            let administradores = await administradorDAO.find({email: form.email.value});
                            if (administradores.length > 0) {
                                //Login de Administrador
                                try {
                                    await administradorDAO.userPasswordLogin(mongoClient, form.email.value, form.senha.value);
                                    setUserLogged(administradores[0]);
                                    setLoggedAdm(true);
                                } catch(err) {
                                    alert(err);
                                }
                            } else {
                                // Usuário não existe.
                                alert('Usuário não existe.');
                            }
                        }
                    }}>
                        <InputText
                            name={'email'}
                            label={'E-mail'}
                            placeholder={'Ex: joao@example.com'} />
                        <InputText
                            name={'senha'}
                            label={'Senha'}
                            type={'password'}
                            placeholder={'Informe sua senha'} />
                        <CheckBox label={'Manter-me Conectado'} />
                        <Button type="submit" text={'Confirmar'}/>
                    </form>
                    {logged && <Redirect to={'/agendamentos'} />}
                    {loggedAdm && <Redirect to={'/agendamento_adm'} />}
                </div>
            </div>
        </div>
    )
};

const mapStateToProps = state => ({
    mongoClient: state.general.mongoClient,
    database: state.general.database,
    userLogged: state.general.userLogged
});

const mapDispatchToProps = dispatch => ({
    setUserLogged: user =>
        dispatch({type: Actions.setUserLogged, payload: user})
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)