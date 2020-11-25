import React from 'react';
import PropTypes from 'prop-types';
import MenuParent from '../MenuParent/MenuParent';
import Notification from './Notification/Notification';
import { useSelector } from 'react-redux';
import NotificacaoDAO, { Notificacao } from '../../../../DAO/NotificacaoDAO';
import { RootState } from '../../../../redux/storeTypes';

const NotificationsMenu = (props) => {
  const { notifications } = useSelector(
    (state: RootState) => state.notifications
  );
  const { userLogged } = useSelector((state: RootState) => state.general);

  return (
    <MenuParent
      style={{ flexDirection: 'column', right: '75px', zIndex: 1005 }}
      key={'notification_menu'}
      menuOpen={props.menuOpen}
    >
      {NotificacaoDAO.filterNotificationsByUser(notifications, userLogged).map(
        (notification: Notificacao) => (
          <Notification key={notification.titulo} notification={notification} />
        )
      )}
    </MenuParent>
  );
};

NotificationsMenu.propTypes = {
  menuOpen: PropTypes.bool.isRequired,
};

export default NotificationsMenu;
