import React from 'react';
import {connect} from "react-redux";
import Actions from "../../redux/actions/actions";
import administradorDAO from "../../DAO/administradorDAO";
import './styles.sass';
import InputText from "../../assets/component/inputText/input";
import Button from "../../assets/component/button/button";
import CheckBox from "../../assets/component/checkbox/checkbox";

const LoginPage = ({mongoClient, userLogged, setUserLogged}) => {

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
            <div className={'ball'} />
            <h1>Hello World!</h1>
            <p>User Logged: {userLogged ? userLogged.id : 'none'}</p>
            <div className={'login'}>
                <h1>Login</h1>
                <div className={'card'}>
                    <form>
                        <InputText label={'E-mail'} placeholder={'Ex: joao@example.com'} />
                        <InputText label={'Senha'} type={'password'} placeholder={'Informe sua senha'} />
                        <CheckBox label={'Manter-me Conectado'} />
                        <Button text={'Confirmar'}/>
                    </form>
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