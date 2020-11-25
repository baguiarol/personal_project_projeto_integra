import React from 'react';
import { Notificacao } from '../../../../../DAO/NotificacaoDAO';
import './Notification.sass';
import moment from 'moment';
import { Node } from 'slate';
import { useDispatch } from 'react-redux';
import { ActionsFn } from '../../../../../redux/actions/actions';
import ModalTypes from '../../../../modal_types';

const serialize = (nodes) => nodes.map((n) => Node.string(n)).join('\n');

const Notification = ({ notification }: { notification: Notificacao }) => {
  const dispatch = useDispatch();

  return (
    <div
      onClick={() => {
        dispatch(ActionsFn.setModalType(ModalTypes.verNotificacao));
        dispatch(ActionsFn.selectNotification(notification));
      }}
      className={'notification_container'}
    >
      <p className={'text'}>{serialize(notification.texto)}</p>
      <p>
        Criado as:{' '}
        {moment(new Date(notification.criadoAs)).format('DD/MM/YYYY HH:mm')}
      </p>
    </div>
  );
};

export default Notification;
