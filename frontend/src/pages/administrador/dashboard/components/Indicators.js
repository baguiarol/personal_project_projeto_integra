import React from 'react';
import { useSelector } from 'react-redux';

const Indicators = () => {
  const [agendamentosPendentes, setAgendamentosPendentes] = React.useState([]);
  const [agendamentosCancelados, setAgendamentosCancelados] = React.useState(
    []
  );

  const { agendamentos } = useSelector((state) => state.agendamentos);

  React.useEffect(() => {
    let agendamentos_nao_cancelados = [];
    let AgendamentosCancelados = [];
    for (let i = 0; i < agendamentos.length; i++) {
      if (!agendamentos[i].cancelado && agendamentos[i].executado) {
        agendamentos_nao_cancelados.push(agendamentos[i]);
      } else if (agendamentos[i].cancelado) {
        AgendamentosCancelados.push(agendamentos[i]);
      }
    }
    setAgendamentosCancelados(AgendamentosCancelados);
    setAgendamentosPendentes(agendamentos_nao_cancelados);
  }, [agendamentos]);

  return (
    <div className={'indicators_container'}>
      <div>
        <h5>
          5,25% <i className={'fa fa-arrow-up'} /> &nbsp; que no mês anterior
        </h5>
        <h2>{agendamentosPendentes.length} reservas no mês</h2>
      </div>
      <div>
        <h2>{agendamentosCancelados.length} reservas canceladas</h2>
        <h5>
          5,25% <i className={'fa fa-arrow-up'} /> &nbsp; que no mês anterior
        </h5>
      </div>
    </div>
  );
};

export default Indicators;
