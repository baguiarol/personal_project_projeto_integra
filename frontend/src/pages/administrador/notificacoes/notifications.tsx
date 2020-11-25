import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AdministradorTopbar from '../../../assets/component/adm_topbar/adm_topbar';
import Button from '../../../assets/component/button/button';
import './notifications.sass';
import Notification from './components/Notification/Notification';
import ModalNewNotificacao from '../../../assets/component/modals/administrativo/modal_new_notificacao/modal_new_notificacao';
import { ActionsFn } from '../../../redux/actions/actions';
import NotificacaoDAO from '../../../DAO/NotificacaoDAO';
import { Redirect } from 'react-router-dom';

const NotificationsPage = () => {
  const { userLogged } = useSelector((state: any) => state.general);
  const { notifications } = useSelector((state: any) => state.notifications);

  const dispatch = useDispatch();

  React.useEffect(() => {
    NotificacaoDAO.findAll().then((res) => {
      dispatch(ActionsFn.setNotifications(res));
    });
  }, [userLogged]);

  const [modalOpen, setModalOpen] = React.useState(false);
  if ('nome' in userLogged) {
    return (
      <div className={'notifications_container'}>
        <AdministradorTopbar pageSelected={'notificacoes'} />
        <ModalNewNotificacao
          show={modalOpen}
          close={() => setModalOpen(false)}
        />
        <div className={'header_notificacoes'}>
          <h1>Notificações</h1>
          <Button onClick={() => setModalOpen(true)} text={'+ Notificação'} />
        </div>
        <div className={'body_notification'}>
          {notifications.map((notification, index) => (
            <Notification data={notification} key={index} />
          ))}
        </div>
      </div>
    );
  } else {
    return <Redirect to={'/'} />;
  }
};

export default NotificationsPage;
