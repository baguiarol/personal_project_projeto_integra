import React from 'react';
import './styles.sass';
import PropTypes from 'prop-types';
import { connect, useDispatch, useSelector } from 'react-redux';
import Button from '../button/button';
import Actions, { ActionsFn } from '../../../redux/actions/actions';
import Menu from './Menu/Menu';
import NotificationsMenu from './NotificationsMenu/NotificationsMenu';
import ModalNotificacao from '../modals/cliente/modal_notificacao/ModalNotificacao';
import ModalTypes from '../../modal_types';
import NotificacaoDAO from '../../../DAO/NotificacaoDAO';

const ClienteTopbar = (props) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [menuNotificationsOpen, setMenuNotificationsOpen] = React.useState(
    false
  );

  const { salas, salaSelected } = useSelector((state) => state.salas);
  const { modalType, userLogged } = useSelector((state) => state.general);
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
            <h2>{userLogged ? userLogged.nome : 'Catherine Torres'}</h2>
            <h4>{userLogged ? userLogged.ocupacao : 'Fisioterapeuta'}</h4>
          </div>
        </div>
        <img
          alt={'profile_pic'}
          className={'profile_pic'}
          src={
            userLogged
              ? userLogged.foto_url
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
                  NotificacaoDAO.filterNotificationsByUser(
                    notifications,
                    userLogged
                  ).length > 0
                    ? 'notifications'
                    : 'notifications hidden'
                }
              >
                {
                  NotificacaoDAO.filterNotificationsByUser(
                    notifications,
                    userLogged
                  ).length
                }
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
          {salas.map((sala, index) => (
            <div
              key={'sala_' + index}
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
      <ModalNotificacao
        open={modalType === ModalTypes.verNotificacao}
        close={() => dispatch(ActionsFn.setModalType(''))}
      />
      <Menu menuOpen={menuOpen} />
      <Menu />
    </div>
  );
};

ClienteTopbar.propTypes = {
  usuario: PropTypes.object,
};

export default ClienteTopbar;
