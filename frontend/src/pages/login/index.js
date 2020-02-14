import React from 'react';
import {connect} from "react-redux";
import Actions from "../../redux/actions/actions";
import administradorDAO from "../../DAO/administradorDAO";
import './styles.sass';
import InputText from "../../assets/component/inputText/input";
import Button from "../../assets/component/button/button";
import CheckBox from "../../assets/component/checkbox/checkbox";
import {Redirect} from "react-router";
import ModoPaisagem from "../../assets/component/modoPaisagem/modoPaisagem";

const LoginPage = ({mongoClient, userLogged, setUserLogged}) => {

    const [logged, setLogged] = React.useState(false);
    const [loggedAdm, setLoggedAdm] = React.useState(false);

    const login = async () => {
        if (mongoClient) {
            const user = await administradorDAO.anonymousLogin(mongoClient);
            setUserLogged(user);
        }
    }

    React.useEffect(() => {
        login();
    });

    return (
        <div className={'login_container'}>
            <ModoPaisagem />
            <div className={'ball'} />
            <div className={'logo_container'}>
                <img src={require('../../assets/integra_logo.png')} />
                <p>Sistema de Gerenciamento</p>
            </div>
            <div className={'login'}>
                <h1>Login</h1>
                <div className={'card'}>
                    <form onSubmit={e => {
                        e.preventDefault();
                        const form = e.target;
                        if (form.email.value === 'adm') {
                            setLoggedAdm(true);
                        } else {
                            setLogged(true);
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