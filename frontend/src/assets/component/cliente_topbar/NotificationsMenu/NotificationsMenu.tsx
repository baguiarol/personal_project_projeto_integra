import React from 'react';
import PropTypes from 'prop-types';
import MenuParent from '../MenuParent/MenuParent';
import Notification from './Notification/Notification';
import { useSelector } from 'react-redux';
import { Notificacao } from '../../../../DAO/NotificacaoDAO';

const NotificationsMenu = (props) => {
  // @ts-ignore
  const { notifications } = useSelector((state) => state.notifications);

  return (
    <MenuParent
      style={{ flexDirection: 'column', right: '75px'}}
      key={'notification_menu'}
      menuOpen={props.menuOpen}
    >
      {notifications.map((notification: Notificacao) => (
        <Notification key={notification.titulo} notification={notification} />
      ))}
    </MenuParent>
  );
};

NotificationsMenu.propTypes = {
  menuOpen: PropTypes.bool.isRequired,
};

export default NotificationsMenu;
