import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { numberToHours } from '../../../../../assets/AuxFunctions';
import './MobileAgendamentos.sass';

const Reserva = (props) => {
  return (
    <div className={'reserva'}>
      <i>
        <h2>Reservado</h2>
      </i>
      <h4>
        {/*{numberToHours(props.reserva.hora_inicio)} ~{' '}*/}
        {/*{numberToHours(props.reserva.hora_fim)}*/}
      </h4>
    </div>
  );
};

const MobileAgendamentos = () => {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const dispatch = useDispatch();
  const {
    userLogged,
    showModal,
    database,
    mongoClient,
    modalType,
  } = useSelector((state: { general }) => state.general);
  const { agendamentos } = useSelector(
    (state: { agendamentos }) => state.agendamentos
  );
  const { salas, salaBloqueios } = useSelector(
    (state: { salas; salaBloqueios }) => state.salas
  );

  if (!userLogged) {
    return <Redirect to={'/'} />;
  } else {
    return (
      <div className={'mobile_agendamentos'}>
        {days.map((day) => (
          <div>
            <h2>{day}</h2>
            <div className={'reservas_container'}>
              <Reserva />
              <Reserva />
              <Reserva />
              <Reserva />
            </div>
          </div>
        ))}
      </div>
    );
  }
};

export default MobileAgendamentos;
