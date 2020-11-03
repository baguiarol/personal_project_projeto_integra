import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import './dash.sass';
import AdministradorTopbar from '../../../assets/component/adm_topbar/adm_topbar';
import Chart from './components/Chart';
import Indicators from './components/Indicators';

const DashboardPage = (props) => {
  const [
    agendamentosPendentes /*, setAgendamentosPendentes */,
  ] = React.useState([]);

  return 'nome' in props.userLogged ? (
    <div>
      <AdministradorTopbar pageSelected={'dashboard'} />
      <Indicators />
      <div className={'bottom_column'}>
        <Chart />
        <div className={'quickdetails_container'}>
          <h2>Informações</h2>
          <h3>{props.profissionais.length} Novos Profissionais</h3>
          <h3>{props.agendamentos.length} agendamentos</h3>
          <h3>
            {props.profissionais.length + props.administradores.length} usuários
            cadastrados
          </h3>
          <h3>{agendamentosPendentes.length} agendamentos até o momento</h3>
          <h3>5 pacientes para profissionais</h3>
          <h3>{} cancelamentos</h3>
          <a
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(props.agendamentos)
            )}`}
            download="filename.json"
          >
            {`Baixar via JSON.`}
          </a>
        </div>
      </div>
    </div>
  ) : (
    <Redirect to={'/'} />
  );
};

const mapStateToProps = (state) => ({
  profissionais: state.profissionais.profissionais,
  agendamentos: state.agendamentos.agendamentos,
  userLogged: state.general.userLogged,
  administradores: state.administradores.administradores,
});

export default connect(mapStateToProps)(DashboardPage);
