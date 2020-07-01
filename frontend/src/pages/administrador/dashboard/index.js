import React from 'react';
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import "./dash.sass";
import AdministradorTopbar from "../../../assets/component/adm_topbar/adm_topbar";
import moment from "moment";

const DashboardPage = props => {
    const [agendamentosPendentes, setAgendamentosPendentes] = React.useState([]);
    const [agendamentosNaoCancelados, setAgendamentosNaoCancelados] = React.useState([]);

    React.useEffect(() => {
        let agendamentos_nao_cancelados = []
        for (let i = 0; i < props.agendamentos.length;i++) {
            if(!props.agendamentos[i].cancelado && props.agendamentos[i].executado){
                agendamentos_nao_cancelados.push(props.agendamentos[i]);
            }
        }
        setAgendamentosPendentes(agendamentos_nao_cancelados)
    }, [props])

    const [agendamentosCancelados, setAgendamentosCancelados] = React.useState([]);
    React.useEffect(() => {
        let agendamentosCancelados = []
        for (let i = 0; i < props.agendamentos.length;i++) {
            if(props.agendamentos[i].cancelado){
                agendamentosCancelados.push(props.agendamentos[i]);
            }
        }
        setAgendamentosCancelados(agendamentosCancelados);
    }, [props]);

    React.useEffect(() => {

        setAgendamentosNaoCancelados(props.agendamentos.filter(value => !value.cancelado));
        //Cria array com datas
        let array = [];
        let date = moment("2020/03/01", "YYYY/MM/DD");
        while (!moment(new Date()).isSame(date, 'day')) {
            array.push({date: date.toDate(), value: 0});
            date.add(1, 'day');
        }

        //Cria Frequency Table
        let tabelaFreq = {};
        props.agendamentos.forEach(agendamento => {
            if (moment(new Date(agendamento.data)).format('DD/MM/YYYY') in tabelaFreq) {
                tabelaFreq[moment(new Date(agendamento.data)).format('DD/MM/YYYY')] += 1;
            } else {
                tabelaFreq[moment(new Date(agendamento.data)).format('DD/MM/YYYY')] = 0;
            }
        });

        //Criar o objeto de verdade {date: moment().toDate(), value: quantidadeDeAgendamentosDoDia }
        Object.keys(tabelaFreq).forEach(key => {
            for (let i = 0; i < array.length; i++) {
                if (moment(array[i].date).isSame(moment(key, 'DD/MM/YYYY'), 'day')) {
                    array[i].value = tabelaFreq[key];
                    break;
                }
            }
        });

        let chart = am4core.create('chart_agendamentos', am4charts.XYChart);

        chart.paddingRight = 20;

        chart.data = array;

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


    return (('nome' in props.userLogged) ? (
        <div>
            <AdministradorTopbar pageSelected={'dashboard'}/>
            <div className={'indicators_container'}>
                <div>
                    <h5>5,25% <i className={'fa fa-arrow-up'}/> &nbsp; que no mês anterior</h5>
                    <h2>{agendamentosPendentes.length} reservas no mês</h2>
                </div>
                <div>
                    <h2>{agendamentosCancelados.length} reservas canceladas</h2>
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
