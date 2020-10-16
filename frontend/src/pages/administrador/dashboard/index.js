import React from 'react';
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import "./dash.sass";
import AdministradorTopbar from "../../../assets/component/adm_topbar/adm_topbar";
import moment from "moment";
import Chart from "./components/Chart";
import Indicators from "./components/Indicators";
import {useDispatch} from "react-redux";
import Actions from "../../../redux/actions/actions";

const DashboardPage = props => {
    const [agendamentosPendentes, setAgendamentosPendentes] = React.useState([]);

    const dispatch = useDispatch()

    return (('nome' in props.userLogged) ? (
        <div>
            <AdministradorTopbar pageSelected={'dashboard'}/>
                <Indicators />
            <div className={'bottom_column'}>
                <Chart />
                <div className={'quickdetails_container'}>
                    <h2>Informações</h2>
                    <h3>{props.profissionais.length} Novos Profissionais</h3>
                    <h3>{props.agendamentos.length} agendamentos</h3>
                    <h3>{props.profissionais.length + props.administradores.length} usuários cadastrados</h3>
                    <h3>{agendamentosPendentes.length} agendamentos até o momento</h3>
                    <h3>5 pacientes para profissionais</h3>
                    <h3>{} cancelamentos</h3>
                </div>
            </div>
        </div>) : <Redirect to={'/'} />
    )
}

const mapStateToProps = state => ({
    profissionais: state.profissionais.profissionais,
    agendamentos: state.agendamentos.agendamentos,
    userLogged: state.general.userLogged,
    administradores: state.administradores.administradores
});

export default connect(mapStateToProps)(DashboardPage);
