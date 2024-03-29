import React from 'react';
import { connect } from 'react-redux';
import '../MenuParent/Menu.sass';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import Actions from '../../../../redux/actions/actions';
import MenuParent from '../MenuParent/MenuParent';

const Menu = (props) => {
  const hist = useHistory();

  const logout = () => {
    props.setUserLogged({});
    localStorage.removeItem('email');
    localStorage.removeItem('pwd');
    hist.push('/');
  };

  return (
    <MenuParent menuOpen={props.menuOpen}>
      <ul>
        <li onClick={() => hist.push('/configuracoes')}>
          Configurações de Perfil
        </li>
        <li onClick={() => logout()}>Sair</li>
      </ul>
    </MenuParent>
  );
};

Menu.propTypes = {
  menuOpen: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({
  setUserLogged: (userLogged) =>
    dispatch({ type: Actions.setUserLogged, payload: userLogged }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
