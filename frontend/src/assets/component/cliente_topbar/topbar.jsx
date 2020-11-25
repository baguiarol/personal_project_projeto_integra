import React from 'react';
import './styles.sass';
import PropTypes from 'prop-types';
import { connect, useDispatch, useSelector } from 'react-redux';
import Button from '../button/button';
import Actions, { ActionsFn } from '../../../redux/actions/actions';
import Menu from './Menu/Menu';
import NotificationsMenu from './NotificationsMenu/NotificationsMenu';

const ClienteTopbar = (props) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuNotificationsOpen, setMenuNotificationsOpen] = React.useState(
    false
  );

  const { salas, salaSelected } = useSelector((state) => state.salas);
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notifications);
  React.useEffect(() => {
    if (salas.length > 0) {
      dispatch(ActionsFn.selectSala(salas[0]));
      console.log(salas[0]);
    }
  }, [salas]);

  return (
    <div className={'topbar_container'}>
      <div className={'content'}>
        <div className={'img_container'}>
          <img
            alt={'logo'}
            src={
              window.innerWidth > 641
                ? require('../../integra_logo.png')
                : require('../../integra_g.png')
            }
          />
        </div>
        <div className={'titulo'}>
          <h2>Portal da Equipe</h2>
          <h4>Agendamentos</h4>
        </div>
        <div className={'user_data'}>
          <div>
            <h2>
              {props.userLogged ? props.userLogged.nome : 'Catherine Torres'}
            </h2>
            <h4>
              {props.userLogged ? props.userLogged.ocupacao : 'Fisioterapeuta'}
            </h4>
          </div>
        </div>
        <img
          alt={'profile_pic'}
          className={'profile_pic'}
          src={
            props.userLogged
              ? props.userLogged.foto_url
              : 'https://randomuser.me/api/portraits/women/43.jpg'
          }
        />
        <Button
          onClick={() => setMenuNotificationsOpen(!menuNotificationsOpen)}
          width={'5%'}
          text={
            <React.Fragment>
              <div
                className={
                  notifications.length > 0
                    ? 'notifications'
                    : 'notifications hidden'
                }
              >
                {notifications.length}
              </div>
              <i className={'fas fa-bell'} />
            </React.Fragment>
          }
          className={'log-off'}
        />
        <Button
          onClick={() => {
            setMenuOpen(!menuOpen);
          }}
          width={'5%'}
          text={
            <i
              className={
                'fas ' + (menuOpen ? 'fa-chevron-up' : 'fa-chevron-down')
              }
            />
          }
          className={'log-off'}
        />
      </div>
      <div>
        <div className={'salas_container'}>
          {salas.map((sala) => (
            <div
              className={
                'nome' in salaSelected
                  ? salaSelected._id.toString() === sala._id.toString()
                    ? 'selected'
                    : ''
                  : ''
              }
              onClick={() => {
                dispatch(ActionsFn.selectSala(sala));
              }}
            >
              <p>{sala.nome}</p>
            </div>
          ))}
        </div>
      </div>
      <NotificationsMenu menuOpen={menuNotificationsOpen} />
      <Menu menuOpen={menuOpen} />
      <Menu />
    </div>
  );
};

ClienteTopbar.propTypes = {
  usuario: PropTypes.object,
};

const mapStateToProps = (state) => ({
  userLogged: state.general.userLogged,
});

const mapDispatchToProps = (dispatch) => ({
  setUserLogged: (user) =>
    dispatch({ type: Actions.setUserLogged, payload: user }),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClienteTopbar);
