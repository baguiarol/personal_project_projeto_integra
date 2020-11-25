import React from 'react';
import { Notificacao } from '../../../../../DAO/NotificacaoDAO';
import './Notification.sass';
import moment from 'moment';
import { Node } from 'slate';

const serialize = (nodes) => nodes.map((n) => Node.string(n)).join('\n');

const Notification = ({ notification }: { notification: Notificacao }) => {
  return (
    <div className={'notification_container'}>
      <h2>{notification.titulo}</h2>
      <p className={'text'}>{serialize(notification.texto)}</p>
      <p>
        Criado as:{' '}
        {moment(new Date(notification.criadoAs)).format('DD/MM/YYYY HH:mm')}
      </p>
    </div>
  );
};

export default Notification;
