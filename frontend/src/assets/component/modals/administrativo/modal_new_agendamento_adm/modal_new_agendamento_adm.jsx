import React from 'react';
import PropTypes from 'prop-types';
import './styles.sass';
import Button from '../../../button/button';
import ModalParent from '../../modal_parent/modal';
import { useSelector } from 'react-redux';
import Options from './tipos/options';
import moment from 'moment/min/moment-with-locales';
import reservaDAO from '../../../../../DAO/reservaDAO';
import logDAO from '../../../../../DAO/logDAO';

const ModalAgendamentoAdm = (props) => {
  const [selectedProfissional, selectProf] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [selectedPage, selectPage] = React.useState('Hora Avulsa');
  const [horaInicial, setHoraInicial] = React.useState(0);
  const [horaFinal, setHoraFinal] = React.useState(0);

  const { userLogged, dateSelected } = useSelector((state) => state.general);
  const { salaSelected, agendamentos } = useSelector(
    (state) => state.agendamentos
  );
  const { salaBloqueios } = useSelector((state) => state.salas);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const profissional = selectedProfissional;
    setLoading(true);

    let data = {
      profissional_id: profissional._id,
      sala_id: salaSelected._id,
      data: moment(dateSelected).toDate(),
      cancelado: false,
      pago: form.sit_pagamento.value === '0',
      executado: false,
    };

    console.log(data);

    if (selectedPage === 'Hora Avulsa') {
      data = {
        ...data,
        valorTotal: Number(
          (
            salaSelected.valor_hora *
            (Number(form.hora_fim.value) - Number(form.hora_inicio.value))
          ).toFixed(2)
        ),
        hora_inicio: Number(form.hora_inicio.value),
        hora_fim: Number(form.hora_fim.value),
      };
    } else if (selectedPage === 'Turno') {
      data = {
        ...data,
        valorTotal: 37.5 * 5,
        hora_inicio: horaInicial,
        hora_fim: horaFinal,
      };
    }

    if (data.hora_inicio >= data.hora_fim) {
      setLoading(false);
      alert('A hora inicial não pode ser maior ou igual a hora final.');
      return;
    }

    const checkIfBlocked = () => {
      if (Array.isArray(salaBloqueios) && salaSelected) {
        for (let bloqueio of salaBloqueios) {
          if (bloqueio.sala && salaSelected._id) {
            if (
              bloqueio.sala.toString() === salaSelected._id.toString() &&
              moment(new Date(bloqueio.dia))
                .add(1, 'day')
                .isSame(dateSelected, 'day')
            )
              return bloqueio;
          }
        }
      }
      return null;
    };

    const OverlappingRanges = (r1_start, r1_finish, r2_start, r2_finish) => {
      let [arr1, arr2] = [[], []];
      for (let i = r1_start; i < r1_finish; i++) {
        arr1.push(i);
      }
      console.log(arr1);
      for (let i = r2_start; i < r2_finish; i++) {
        arr2.push(+i);
      }
      console.log(arr2);
      for (let el of arr1) {
        if (arr2.includes(el)) {
          return true;
        }
      }
      return false;
    };

    const bloqueio = checkIfBlocked();
    if (bloqueio) {
      if (
        OverlappingRanges(
          data.hora_inicio,
          data.hora_fim,
          bloqueio.horaInicio,
          bloqueio.horaFim
        )
      ) {
        alert(
          'O horário se encontra indisponível pois a sala está bloqueada nesse horário. Caso queira adicionar, ' +
            'desbloqueie a sala.'
        );
        setLoading(false);
        return;
      }
    }

    if ('_id' in selectedProfissional) {
      let agendamentosSala = reservaDAO.getAgendamentosFromSala(
        agendamentos,
        salaSelected
      );
      let agendamentosDia = agendamentosSala.filter(
        (agendamento) =>
          moment(agendamento.data).isSame(dateSelected, 'day') &&
          !agendamento.cancelado
      );
      await reservaDAO.createHoraAvulsa(
        data,
        agendamentosDia,
        dateSelected,
        async () => {
          try {
            await logDAO.create({
              usuario: userLogged,
              log: `Nova reserva ${selectedProfissional.nome} ${moment(
                dateSelected
              ).format('DD-MM-YYYY')} ${data.hora_inicio}h-${data.hora_fim}h ${
                salaSelected.nome
              }`,
              data_hora: new Date(),
            });
            await reservaDAO.create(data);
            setLoading(false);
            alert('Adicionado com sucesso!');
            props.close();
          } catch (e) {
            setLoading(false);
            alert(e);
            props.close();
          }
        },
        async () => {
          alert('O horário já se encontra reservado!');
          setLoading(false);
        }
      );
    } else {
      alert('Por favor, selecione um profissional.');
      setLoading(false);
    }
  };

  return (
    <ModalParent
      show={props.show}
      onSubmit={handleSubmit}
      header={
        <header>
          <div>
            <h1>Adicionar Reserva</h1>
            <h3>
              {moment(dateSelected)
                .locale('pt-BR')
                .format('DD [de] MMMM [de] YYYY')}{' '}
              - {salaSelected.nome}
            </h3>
          </div>
          <div className={'close_container'} onClick={props.close}>
            <i className={'fa fa-times'} />
          </div>
        </header>
      }
      body={
        <div>
          <Options
            setHoraInicial={setHoraInicial}
            setHoraFinal={setHoraFinal}
            selectedPage={selectedPage}
            selectPage={selectPage}
            selectProf={selectProf}
          />
        </div>
      }
      footer={
        <div className={'footer'}>
          <Button loading={loading} type={'submit'} text={'Confirmar'} />
        </div>
      }
    />
  );
};

ModalAgendamentoAdm.propTypes = {
  show: PropTypes.bool.isRequired,
  close: PropTypes.func,
};

export default ModalAgendamentoAdm;
