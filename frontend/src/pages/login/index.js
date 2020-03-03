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

const LoginPage = ({mongoClient, setUserLogged}) => {

    const [logged, setLogged] = React.useState(false);
    const [loggedAdm, setLoggedAdm] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [checked, setChecked] = React.useState(false);

    const saveUserLogged = (email, pwd) => {
        if (checked) {
            localStorage.setItem('email', email);
            localStorage.setItem('pwd', pwd);
            alert("Adicionado ao local storage");
        }
    }

    const performLogin = async (email, senha) => {
        let [clientes, administradores] = [[], []];
        try {
            await clienteDAO.login(mongoClient, email, senha);
            clientes = await clienteDAO.find({email: email});
            if (clientes.length > 0) {
                setLogged(true);
                setUserLogged(clientes[0]);
                saveUserLogged(email, senha);
            } else {
                administradores = await administradorDAO.find({email: email});
                if (administradores.length > 0) {
                    setLoggedAdm(true);
                    setUserLogged(administradores[0]);
                    saveUserLogged(email, senha);
                } else {
                    alert('Erro interno. Por favor, contate os desenvolvedores.');
                }
            }
        } catch (err) {
            console.log(err);
            if (err.errorCode === 46) {
                alert('Usuário ou senha inválidos.');
            } else {
                alert('Erro desconhecido! Log do erro '+ err);
            }
        }
    }

    React.useEffect(() => {
        let [email, senha] = [localStorage.getItem('email'), localStorage.getItem('pwd')];
        setLoading(true);
        if (mongoClient)
            if (email && senha)
                performLogin(email, senha).then(() => setLoading(false));
    }, [mongoClient]);

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
                        setLoading(true);
                        await performLogin(e.target.email.value, e.target.senha.value);
                        setLoading(false);
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
                        <CheckBox
                            onCheck={ checked => {
                                setChecked(!checked)
                            }}
                            label={'Manter-me Conectado'} />
                        <Button loading={loading} type={'submit'} text={'Confirmar'}/>
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
});

const mapDispatchToProps = dispatch => ({
    setUserLogged: user =>
        dispatch({type: Actions.setUserLogged, payload: user})
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)