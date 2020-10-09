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
import {useHistory} from "react-router-dom";
import moment from 'moment';
import ForgotPasswordModal from "../../assets/component/modals/login/ForgotPasswordModal";
import {UserPasswordAuthProviderClient} from "mongodb-stitch-browser-sdk";
import TipoUsuarioModal from "../../assets/component/modals/login/TipoUsuarioModal/TipoUsuarioModal";
import {useDispatch} from "react-redux";

const LoginPage = ({mongoClient, userLogged, setUserLogged}) => {

    const [logged, setLogged] = React.useState(false);
    const [loggedAdm, setLoggedAdm] = React.useState(false);
    const [loading, setLoading] = React.useState(true);
    const [checked, setChecked] = React.useState(false);
    const [modalForgotPassword, setModalForgotPassword] = React.useState(false)
    const [tipoUsuarioShow, setTipoUsuario] = React.useState(false)

    const [admArray, setAdmArray] = React.useState(null)
    const [clientesArray, setClientesArray] = React.useState(null)

    const d = useDispatch()
    const story = useHistory()

    const saveUserLogged = (email, pwd) => {
        if (checked) {
            localStorage.setItem('email', email);
            localStorage.setItem('pwd', pwd);
        }
    }

    const performLogin = async (email, senha) => {
        let [clientes, administradores] = [[], []];
        setLoading(true);
        try {
            await clienteDAO.login(mongoClient, email, senha);
            clientes = await clienteDAO.find({email: email});
            administradores = await administradorDAO.find({email: email});
            if (clientes.length > 0 && administradores.length > 0) {
                setTipoUsuario(true)
                setAdmArray(administradores)
                setClientesArray(clientes)
                if (checked)
                    saveUserLogged(email, senha);
            } else if (clientes.length > 0) {
                setUserLogged(clientes[0]);
                story.push('/agendamentos')
                if (checked)
                    saveUserLogged(email, senha);
            } else if (administradores.length > 0) {
                setUserLogged(administradores[0])
                story.push('/agendamento_adm')
                if (checked)
                    saveUserLogged(email, senha);
            }
            if (administradores.length <= 0 && clientes.length <= 0) {
                alert('Erro interno. Por favor, contate os desenvolvedores.');
            }
        } catch (err) {
            console.log(err);
            if (err.errorCode === 46) {
                alert('Usuário ou senha inválidos.');
            } else {
                alert('Erro desconhecido! Log do erro ' + err);
            }
        }
        setLoading(false);
    }

    React.useEffect(() => {
        let [email, senha] = [localStorage.getItem('email'), localStorage.getItem('pwd')];
        if (mongoClient) {
            if (email && senha) {
                setLoading(true)
                performLogin(email, senha).then(() => {
                    setLoading("false")
                }).catch(e => setLoading(false));
            } else {
                setLoading(false)
            }
        }
    }, [mongoClient]);

    let matrix = new Array(5);
    for (let i = 0; i < 5; i++) {
        matrix[i] = new Array(7).fill(0);
    }
    let iterador = moment(new Date()).startOf('month');
    let dataInicial = moment()

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 7; j++) {
            if (iterador.toDate().getDay() === j && iterador.isSame(dataInicial, 'month')) {
                matrix[i][j] = iterador.date();
                iterador.add(1, 'day');
            } else {
                matrix[i][j] = 0;
            }
        }
    }

    console.log(matrix);

    const hist = useHistory();

    return (
        <div className={'login_container'}>
            <ModoPaisagem/>
            <TipoUsuarioModal
                show={tipoUsuarioShow}
                onClose={() => {
                    setTipoUsuario(false)
                    setLoading(false)
                }}
                onClickAdm={() => {
                    // setUserLogged(admArray[0])
                    d(Actions.SetUserLogged(admArray[0]));
                    story.push('/agendamento_adm')
                }}
                onClickProfissional={() => {
                    setUserLogged(clientesArray[0])
                    story.push('/agendamentos')
                }}
            />
            <ForgotPasswordModal
                onSubmit={async e => {
                    e.preventDefault()
                    const form = e.target;
                    setLoading(true)
                    try {
                        await mongoClient
                            .auth
                            .getProviderClient(UserPasswordAuthProviderClient.factory)
                            .sendResetPasswordEmail(form.email.value);
                        alert('Por favor, cheque seu e-mail, enviamos um link para redefinição de senha.')
                    } catch (e) {
                        alert(e)
                    }
                    setModalForgotPassword(false)
                    setLoading(false)
                }}
                loading={loading}
                onClose={() => {setModalForgotPassword(false)}}
                show={modalForgotPassword}/>
            <div className={'ball'}/>
            <div className={'logo_container'}>
                <img
                    alt={'integra_logo'}
                    src={require('../../assets/integra_logo.png')}/>
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
                            placeholder={'Ex: joao@example.com'}/>
                        <InputText
                            name={'senha'}
                            label={'Senha'}
                            type={'password'}
                            placeholder={'Informe sua senha'}/>
                        <CheckBox
                            onCheck={checked => {
                                setChecked(!checked)
                            }}
                            label={'Manter-me Conectado'}/>
                        <Button loading={loading} type={'submit'} text={'Confirmar'}/>
                    </form>
                </div>
                <p onClick={() => setModalForgotPassword(true)} className={'forgot_pwd'}>Esqueceu sua senha?</p>
            </div>
        </div>
    )
};

const mapStateToProps = state => ({
    mongoClient: state.general.mongoClient,
    database: state.general.database,
    userLogged: state.general.userLogged,
});

const mapDispatchToProps = dispatch => ({
    setUserLogged: user =>
        dispatch({type: Actions.setUserLogged, payload: user}),
    //Para uso somente no login do cliente.
    setProfissionalReservas: reservas =>
        dispatch({type: Actions.setProfissionalReservas, payload: reservas}),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)