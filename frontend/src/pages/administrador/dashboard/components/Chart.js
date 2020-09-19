import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import moment from "moment";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

const Chart = props => {

    const [agendamentosNaoCancelados, setAgendamentosNaoCancelados] = React.useState([]);

    React.useEffect(() => {

        setAgendamentosNaoCancelados(props.agendamentos.filter(value => !value.cancelado));
        //Cria array com datas
        let array = [];
        let date = moment("2020/08/01", "YYYY/MM/DD");
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

    return (
        <div className={'agendamentos_chart_container'}>
            <h2>Agendamentos</h2>
            <div id={'chart_agendamentos'}/>
        </div>
    )
}

const mapStateToProps = state => ({
    agendamentos: state.agendamentos.agendamentos,

})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Chart)