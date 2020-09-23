import React from 'react';
import PropTypes from 'prop-types';
import "./CalendarAgendamentos.sass";
import {connect} from "react-redux";
import Actions from "../../../redux/actions/actions";
import ModalTypes from "../../modal_types";
import {numberIsBetween} from "../../AuxFunctions";
import reservaDAO from "../../../DAO/reservaDAO";
import Moment from "moment/min/moment-with-locales";
import {extendMoment} from "moment-range";
import sala_bloqueioDAO from "../../../DAO/sala_bloqueioDAO";
import {replace} from "@amcharts/amcharts4/.internal/core/utils/Array";
import NovoAgendamento from "./components/NovoAgendamento";
import {checkBloqueado, checkIfItsBetween, setClassStringByTheData} from "./components/AuxFunctions";

const moment = extendMoment(Moment)

const fillHoras = (sabado) => {
    let array = [];
    let [horaInicial, horaFinal] = [9, 21]
    if (sabado)
        [horaInicial, horaFinal] = [8, 13]
    for (let i = 0; i < horaFinal - horaInicial; i++)
        array.push({label: i + horaInicial + ':00', value: i + horaInicial});
    return array;
}

const days = ["Domingo", "Segunda-Feira", "Terça-Feira", "Quarta-Feira", "Quinta-Feira", "Sexta-Feira", "Sábado"];

const CalendarAgendamentos = props => {

    const [horas, setHoras] = React.useState(fillHoras(props.dateSelected.getDay() === 6))

    React.useEffect(() => {
        sala_bloqueioDAO.findAll().then(res => {
            props.setBloqueiosSalas(res)
        })
    }, [])

    //Atualiza lista de horas do dia.
    React.useEffect(() => {
        //Condição verifica se é um sábado.
        setHoras(fillHoras(props.dateSelected.getDay() === 6))
    }, [props.dateSelected])

    React.useEffect(() => {
        // console.log('Sala 07', props.agendamentos.filter((value) => moment(new Date(value.data)).isSame(new Date(), 'day') && value.sala.nome === 'Sala 7'));
        // console.log('Sala 06', props.agendamentos.filter((value) => moment(new Date(value.data)).isSame(new Date(), 'day') && value.sala.nome === 'Sala 6'))
        // console.log('Sala 10', props.agendamentos.filter((value) => moment(new Date(value.data)).isSame(new Date(), 'day') && value.sala.nome === 'Sala 10'))
        // console.log('Sala 09', props.agendamentos.filter((value) => moment(new Date(value.data)).isSame(new Date(), 'day') && value.sala.nome === 'Sala 9'))
        // console.log('Sala 08', props.agendamentos.filter((value) => moment(new Date(value.data)).isSame(new Date(), 'day') && value.sala.nome === 'Sala 8'))

    }, [props.agendamentos])

    return (
        <div className={'calendar_agendamentos_container'}>
            <h1 style={{display: 'flex'}}>
                <span
                    onClick={() => {
                        props.selectDate(moment(props.dateSelected).subtract(1, 'day').toDate())
                    }}
                    className={'chevron_date'}
                    style={{float: 'left', margin: 'auto 0'}}>
                    <i className={'fa fa-chevron-left'}/>
                </span>
                <span style={{flexGrow: 1, display: 'flex', flexDirection: 'column', cursor: 'pointer'}}
                      onClick={() => props.openModal(ModalTypes.selectDay)}>
                    <span style={{margin: 0}}>
                        {moment(props.dateSelected).locale('pt-BR').format(' DD MMMM YYYY')}
                    </span>
                    <span style={{fontSize: 13, color: '#CCC', margin: 4, fontWeight: 'normal'}}>
                        {days[props.dateSelected.getDay()]}
                    </span>
                </span>
                <span
                    onClick={() => {
                        props.selectDate(moment(props.dateSelected).add(1, 'day').toDate())
                    }}
                    className={'chevron_date'}
                    style={{float: 'right', margin: 'auto 0'}}>
                    <i className={'fa fa-chevron-right'}/>
                </span>
            </h1>
            <div className={'container_table'}>
                <table className={'calendar_table'}>
                    {/*aqui vai a numeracao das salas*/}
                    <thead>
                    <tr>
                        <th style={{width: '10%'}}></th>
                        {
                            props.salas.map((sala, index) => <th key={index}>{sala.nome}</th>)
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {
                        //A tabela é composta por horas x salas;
                        horas.map((hora, index) => (
                            <tr key={index}>
                                <td>{hora.label}</td>
                                {/* Início da declaração das salas */}
                                {props.salas.map((sala, indexSala) => {
                                    // A função abaixo recebe todos os agendamentos da sala.
                                    let agendamentosDaSala = reservaDAO.getAgendamentosFromSala(props.agendamentos, sala);
                                    let [isOccupied, isMonthly] = [false, false];
                                    let agnd = null;
                                    // Cada agendamento é verificado em cada bloco de horas.
                                    agendamentosDaSala.forEach((agendamento, index) => {
                                        if ('hora_inicio' in agendamento) {
                                            if (numberIsBetween(hora.value, agendamento.hora_inicio, agendamento.hora_fim)
                                                && (moment(props.dateSelected).isSame(new Date(agendamento.data), 'day'))
                                                && !agendamento.cancelado) {
                                                isOccupied = true;
                                                agnd = agendamento;
                                            }
                                            //Verificação de aluguéis mensais.
                                        } else if ('mes' in agendamento
                                            && moment(agendamento["mes"]).isSame(props.dateSelected, 'month')) {
                                            isMonthly = true;
                                        }
                                    });
                                    if (!isOccupied) {
                                        if (isMonthly) {
                                            return (<td key={indexSala} className={'alugado'}>
                                                <i>Alugado Mensalmente</i>
                                            </td>)
                                        } else if (checkBloqueado(props.bloqueiosSalas, sala, hora.value, props.dateSelected)) {
                                            return <td className={'alugado'} key={indexSala}>
                                                <i>Bloqueada</i>
                                            </td>
                                        } else {
                                            return (<NovoAgendamento sala={sala}/>)
                                        }
                                    } else if (agnd) {
                                        if (isMonthly) {
                                            return (<td key={indexSala} className={'occupied'}>
                                                {agnd ? (agnd.profissional ? agnd.profissional.nome :
                                                    <i>Usuário Excluído</i>) : ''}
                                            </td>)
                                        } else {
                                            if (agnd.hora_inicio === hora.value && !('horasCanceladas' in agnd)) {
                                                return (<td
                                                    onClick={() => {
                                                        props.openModal(ModalTypes.editarAgendamento);
                                                        props.selectAgendamentos(agnd);
                                                    }}
                                                    key={indexSala}
                                                    rowSpan={agnd.hora_fim - agnd.hora_inicio}
                                                    className={
                                                        'occupied ' + setClassStringByTheData(agnd)}>
                                                    {agnd ? (agnd.profissional ? agnd.profissional.nome :
                                                        <i>Usuário Excluído</i>) : ''}
                                                </td>)
                                            }
                                            // LEGACY ----------- FAVOR NÃO EXCLUIR, apesar de parecer que precise.
                                            else if ('horasCanceladas' in agnd) {
                                                if ((agnd.hora_inicio === hora.value) &&
                                                    (agnd.hora_inicio < agnd.horasCanceladas[0])) {
                                                    return (<td
                                                        onClick={() => {
                                                            props.openModal(ModalTypes.editarAgendamento);
                                                            props.selectAgendamentos(agnd);
                                                        }}
                                                        rowSpan={agnd.horasCanceladas[0] - agnd.hora_inicio}
                                                        className={
                                                            'occupied ' + setClassStringByTheData(agnd)}>
                                                        {agnd ? (agnd.profissional ? agnd.profissional.nome :
                                                            <i>Usuário Excluído</i>) : ''}
                                                    </td>)
                                                }
                                                if (numberIsBetween(hora.value, agnd.horasCanceladas[0], agnd.horasCanceladas[1])) {
                                                    return (<NovoAgendamento sala={sala}/>)
                                                } else if ((agnd.horasCanceladas[1] === hora.value) &&
                                                    (agnd.horasCanceladas[1] !== agnd.hora_fim)) {
                                                    return (<td
                                                        onClick={() => {
                                                            props.openModal(ModalTypes.editarAgendamento);
                                                            props.selectAgendamentos(agnd);
                                                        }}
                                                        rowSpan={agnd.hora_fim - agnd.horasCanceladas[1]}
                                                        className={
                                                            'occupied ' + setClassStringByTheData(agnd)}>
                                                        {agnd ? (agnd.profissional ? agnd.profissional.nome :
                                                            <i>Usuário Excluído</i>) : ''}
                                                    </td>)
                                                }
                                            // FIM DO LEGACY ----------- FAVOR NÃO EXCLUIR, apesar de parecer que precise.
                                            } else {
                                                return <></>
                                            }
                                        }
                                    }
                                })}
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

CalendarAgendamentos.propTypes = {
    agendamentos: PropTypes.array,
}

const mapStateToProps = state => ({
    salas: state.salas.salas,
    agendamentos: state.agendamentos.agendamentos,
    dateSelected: state.general.dateSelected,
    bloqueiosSalas: state.salas.bloqueiosSalas,
});

const mapDispatchToProps = dispatch => ({
    selectDate: date => dispatch({type: Actions.selectDate, payload: date}),
    openModal: open => dispatch({type: Actions.showModal, payload: open}),
    setSalas: salas => dispatch({type: Actions.setSalas, payload: salas}),
    setBloqueiosSalas: bloqueios => dispatch({type: Actions.setBloqueiosSalas, payload: bloqueios}),
    selectAgendamentos: agendamento => dispatch({type: Actions.selectAgendamentos, payload: agendamento}),
    selectSala: sala => dispatch({type: Actions.selectSala, payload: sala}),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarAgendamentos);
