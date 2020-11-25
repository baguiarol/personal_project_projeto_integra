import React from 'react';
import { connect } from 'react-redux';
import './Menu.sass';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import Actions from '../../../../redux/actions/actions';

const Menu = (props) => {
  const hist = useHistory();

  return (
    <div
      {...props}
      className={props.menuOpen ? 'menu_container open' : 'menu_container'}
    >
      {props.children}
    </div>
  );
};

Menu.propTypes = {
  menuOpen: PropTypes.bool.isRequired,
  children: PropTypes.element,
};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => ({
  setUserLogged: (userLogged) =>
    dispatch({ type: Actions.setUserLogged, payload: userLogged }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
