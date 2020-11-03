import React from 'react';
import AdministradorTopbar from '../../../assets/component/adm_topbar/adm_topbar';
import CalendarAgendamentos from '../../../assets/component/calendar_agendamentos/CalendarAgendamentos';
import './agendamentos.sass';
import ModalTypes from '../../../assets/modal_types';
import PropTypes from 'prop-types';
import { ActionsFn } from '../../../redux/actions/actions';
import { connect, useDispatch, useSelector } from 'react-redux';
import ModalAgendamentoAdm from '../../../assets/component/modals/administrativo/modal_new_agendamento_adm/modal_new_agendamento_adm.jsx';
import clienteDAO from '../../../DAO/clienteDAO';
import reservaDAO from '../../../DAO/reservaDAO';
import logDAO from '../../../DAO/logDAO';
import { Redirect, useHistory } from 'react-router';
import ModalEditAgendamento from '../../../assets/component/modals/administrativo/modal_edit_agendamento/EditAgendamento';
import sala_bloqueioDAO from '../../../DAO/sala_bloqueioDAO';
import ModalSelectDay from '../../../assets/component/modals/administrativo/modal_select_day/ModalSelectDay';
import salaDAO from '../../../DAO/salaDAO';

const AgendamentosAdministrador = (props) => {
  const hist = useHistory();

  const { database, userLogged, modalType, showModal } = useSelector(
    (state) => state.general
  );
  const dispatch = useDispatch();

  const watchItems = () => {
    const streamPromise = database.collection('reservas').watch();
    const getStream = () => streamPromise;
    const closeStream = () => streamPromise.then((stream) => stream.close);
    return [getStream, closeStream];
  };

  const updateAgendamentos = async () => {
    let agendamentos = await reservaDAO.findAllInClient();
    dispatch(ActionsFn.setSalas(agendamentos[0]));
    dispatch(ActionsFn.setProfissionais(agendamentos[1]));
    dispatch(ActionsFn.setAgendamentos(agendamentos[2]));
  };

  React.useEffect(() => {
    if (database) {
      const [getStream, closeStream] = watchItems();
      getStream().then((stream) => {
        stream.onNext(() => {
          updateAgendamentos().then(() => {
            console.log('updated');
          });
        });
      });
      return closeStream;
    }
  }, [database]);

  React.useEffect(() => {
    if (clienteDAO.db) {
      if ('ocupacao' in userLogged) {
        hist.push('/');
      }

      sala_bloqueioDAO.findAll().then((res) => {
        dispatch(ActionsFn.setBloqueiosSalas(res));
      });
      console.time('Time find All in client');
      reservaDAO.findAllInClient(props).then((res) => {
        dispatch(ActionsFn.setSalas(res[0]));
        dispatch(ActionsFn.setProfissionais(res[1]));
        dispatch(ActionsFn.setAgendamentos(res[2]));
        console.timeEnd('Time find All in client');
      });
      logDAO.findAll().then((logs) => {
        dispatch(ActionsFn.setLogs(logs));
      });
    }
  }, []);

  return 'nome' in userLogged ? (
    <div>
      <AdministradorTopbar pageSelected={'agendamento_adm'} />
      <div className={'container_salas'}>
        <ModalSelectDay
          show={showModal && modalType === ModalTypes.selectDay}
          close={() => dispatch(ActionsFn.closeModal())}
          onChangeDay={(day) => {
            if (day) dispatch(ActionsFn.selectDate(day));
          }}
        />
        <ModalAgendamentoAdm
          close={() => dispatch(ActionsFn.closeModal())}
          show={showModal && modalType === ModalTypes.adicionarAgendamentoAdm}
        />
        <ModalEditAgendamento
          close={() => dispatch(ActionsFn.closeModal())}
          show={showModal && modalType === ModalTypes.editarAgendamento}
        />
        <CalendarAgendamentos />
      </div>
    </div>
  ) : (
    <Redirect to={'/'} />
  );
};

AgendamentosAdministrador.propTypes = {
  agendamentos: PropTypes.array,
};

const mapStateToProps = (state) => ({
  agendamentos: state.agendamentos.agendamentos,
});

export default connect(mapStateToProps)(AgendamentosAdministrador);
