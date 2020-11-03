import moment from 'moment/min/moment-with-locales.min';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { numberToHours } from '../../../../../assets/AuxFunctions';
import './MobileAgendamentos.sass';
import reservaDAO from '../../../../../DAO/reservaDAO';
import { ActionsFn } from '../../../../../redux/actions/actions';
import ModalTypes from '../../../../../assets/modal_types';

const Reserva = (props) => {
  return (
    <div className={'reserva'}>
      <i>
        <h2>Reservado</h2>
      </i>
      <h4>
        {numberToHours(props.reserva.hora_inicio)} ~{' '}
        {numberToHours(props.reserva.hora_fim)}
      </h4>
    </div>
  );
};

const MobileAgendamentos = () => {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const [selectedDate, selectDate] = React.useState(moment(new Date()));

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
  const { salas, salaBloqueios, salaSelected } = useSelector(
    (state: { salas; salaBloqueios }) => state.salas
  );

  const renderReservas = (dateSelected, agendamentos) => {
    const agendamentosDoDia = agendamentos.filter((agendamento) =>
      moment(agendamento.data).isSame(dateSelected, 'day')
    );
    const agendamentosDaSalaEDia = reservaDAO.getAgendamentosFromSala(
      agendamentosDoDia,
      salaSelected
    );

    return (
      <React.Fragment>
        {agendamentosDaSalaEDia.map((agendamento) => (
          <Reserva reserva={agendamento} />
        ))}
        <div
          onClick={() => {
            const dateF = dateSelected.toDate();
            dateF.setHours(12);
            dispatch(ActionsFn.selectDate(dateF));
            dispatch(ActionsFn.openModal(ModalTypes.reservaCliente));
          }}
          className={'add'}
        >
          <i className={'fas fa-plus'} />
        </div>
      </React.Fragment>
    );
  };

  if (!userLogged) {
    return <Redirect to={'/'} />;
  } else {
    return (
      <div className={'mobile_agendamentos'}>
        {days.map((day, index) => {
          const date = moment(selectedDate.toDate())
            .locale('pt-BR')
            .startOf('week')
            .add(index, 'days');

          if (index === 0) {
            return <></>
          }
          return (
            <div>
              <h2>{day}</h2>
              <div className={'reservas_container'}>
                {renderReservas(date, agendamentos)}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
};

export default MobileAgendamentos;
