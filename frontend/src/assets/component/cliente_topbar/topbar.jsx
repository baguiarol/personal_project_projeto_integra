import React from 'react';
import "./styles.sass";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import Button from "../button/button";
import Actions from "../../../redux/actions/actions";
import {useHistory} from "react-router";
import Menu from "./Menu/Menu";

const ClienteTopbar = props => {

    const hist = useHistory();

    const logout = () => {
        props.setUserLogged({});
        localStorage.removeItem('email');
        localStorage.removeItem('pwd');
        hist.push('/');
    };

    const [menuOpen, setMenuOpen] = React.useState(false)

    return (
        <div className={'topbar_container'}>
            <div className={'img_container'}>
                <img
                    alt={'logo'}
                    src={require('../../integra_logo.png')} />
            </div>
            <div className={'titulo'}>
                <h2>Portal da Equipe</h2>
                <h4>Agendamentos</h4>
            </div>
            <div className={'user_data'}>
                <div>
                    <h2>{props.userLogged ? props.userLogged.nome : 'Catherine Torres'}</h2>
                    <h4>{props.userLogged ? props.userLogged.ocupacao : 'Fisioterapeuta'}</h4>
                </div>
            </div>
            <img
                alt={'profile_pic'}
                className={'profile_pic'} src={
                    props.userLogged ?
                        props.userLogged.foto_url : 'https://randomuser.me/api/portraits/women/43.jpg'} />
                        <Button
                            onClick={() => {
                                // logout();
                                setMenuOpen(!menuOpen)
                            }}
                            width={'5%'}
                            text={<i className={'fas ' + (menuOpen ? 'fa-chevron-up' : 'fa-chevron-down')}/>}
                            className={'log-off'}/>
                            <Menu menuOpen={menuOpen} />
        </div>
    )
}

ClienteTopbar.propTypes = {
    usuario: PropTypes.object,
}

const mapStateToProps = state => ({
    userLogged: state.general.userLogged,
});

const mapDispatchToProps = dispatch => ({
    setUserLogged: user => dispatch({type: Actions.setUserLogged, payload: user}),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClienteTopbar);
