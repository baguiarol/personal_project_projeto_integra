import React from 'react';
import {connect} from 'react-redux'

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import "./dash.sass";
import AdministradorTopbar from "../../../assets/component/adm_topbar/adm_topbar";
import agendamentos from '../agendamentos';




const DashboardPage = props => {
    const [agendamentosPendentes, setAgendamentosPendentes] = React.useState([]);
    React.useEffect(() => {
        let agendamentos_nao_cancelados = []
        for (let i = 0; i < props.agendamentos.length;i++) {
            if(!props.agendamentos[i].cancelado && props.agendamentos[i].executado){
                agendamentos_nao_cancelados.push(props.agendamentos[i]);
            }
        }
        setAgendamentosPendentes(agendamentos_nao_cancelados)
    })

    const [agendamentosCancelados, setAgendamentosCancelados] = React.useState([]);
    React.useEffect(() => {
        let agendamentosCancelados = []
        for (let i = 0; i < props.agendamentos.length;i++) {
            if(props.agendamentos[i].cancelado){
                agendamentosCancelados.push(props.agendamentos[i]);
            }
        }
        setAgendamentosCancelados(agendamentosCancelados)
    })


    React.useEffect(() => {
        let chart = am4core.create('chart_agendamentos', am4charts.XYChart);

        chart.paddingRight = 20;

        let data = [];
        let visits = 10;
        for (let i = 1; i < 366; i++) {
            visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
            data.push({ date: new Date(2018, 0, i), name: "name" + i, value: visits });
        }

        chart.data = data;

        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0;

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.minWidth = 35;

        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "date";
        series.dataFields.valueY = "value";

        series.tooltipText = "{valueY.value}";
        chart.cursor = new am4charts.XYCursor();

        let scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(series);
        chart.scrollbarX = scrollbarX;
    }, []);

    return (
        <div>
            <AdministradorTopbar pageSelected={'dashboard'}/>
            <div className={'indicators_container'}>
                <div>
                    <h5>5,25% <i className={'fa fa-arrow-up'}/> &nbsp; que no mês anterior</h5>
                    <h2>25 reservas no mês</h2>
                </div>
                <div>
                    <h2>35 reservas canceladas</h2>
                    <h5>5,25% <i className={'fa fa-arrow-up'}/> &nbsp; que no mês anterior</h5>
                </div>
            </div>
            <div className={'bottom_column'}>
                <div className={'agendamentos_chart_container'}>
                    <h2>Agendamentos</h2>
                    <div id={'chart_agendamentos'}/>
                </div>
                <div className={'quickdetails_container'}>
                    <h2>Informações</h2>
                    <h3>{props.profissionais.length} Novos Profissionais</h3>
                    <h3>{props.agendamentos.length} agendamentos</h3>
                    <h3>{props.profissionais.length + props.administradores.length} usuários cadastrados</h3>
                    <h3>{agendamentosPendentes.length} agendamentos até o momento</h3>
                    <h3>5 pacientes para profissionais</h3>
                    <h3>{agendamentosCancelados.length} cancelamentos</h3>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    profissionais: state.profissionais.profissionais,
    agendamentos: state.agendamentos.agendamentos,
    administradores: state.administradores.administradores
});

export default connect(mapStateToProps)(DashboardPage);