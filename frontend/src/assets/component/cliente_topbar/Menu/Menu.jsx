import React from 'react';
import {connect} from 'react-redux';
import "./Menu.sass"
import PropTypes from 'prop-types'
import {useHistory} from "react-router";
import Actions from "../../../../redux/actions/actions";

const Menu = props => {


    const hist = useHistory();

    const logout = () => {
        props.setUserLogged({});
        localStorage.removeItem('email');
        localStorage.removeItem('pwd');
        hist.push('/');
    };

    return (
     <div className={props.menuOpen ? 'menu_container open' : 'menu_container'}>
         <ul>
             <li onClick={() => hist.push('/configuracoes')}>Configurações de Perfil</li>
             <li onClick={() => logout()}>Sair</li>
         </ul>
     </div>
 );
}

Menu.propTypes = {
    menuOpen: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
    setUserLogged: userLogged => dispatch({type: Actions.setUserLogged, payload: userLogged})
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
