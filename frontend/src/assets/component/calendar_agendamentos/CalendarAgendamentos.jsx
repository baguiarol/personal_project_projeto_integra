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

const moment = extendMoment(Moment)

const fillHoras = () => {
    let array = [];
    for (let i = 0; i < 13; i++)
        array.push({label: i + 9 + ':00', value: i + 9});
    return array;
}

const horas = fillHoras();

const CalendarAgendamentos = props => {

    React.useEffect(() => {
        sala_bloqueioDAO.findAll().then(res => {
            props.setBloqueiosSalas(res)
        })
    }, [])

    const checkIfItsBetween = (num, intervalBegin, intervalEnd) => {
        return (num >= intervalBegin && num < intervalEnd)
    }

    const checkBloqueado = (bloqueios, sala, hora) => {
        for (let bloqueio of bloqueios) {
            if (Array.isArray(bloqueio.sala)) {
                for (let currentSala of bloqueio.sala) {
                    if (currentSala.toString() === sala._id.toString() &&
                        moment(new Date(bloqueio.dia)).add(1, 'day').isSame(props.dateSelected, 'day')) {
                        if (bloqueio.wholeDay) {
                            return true
                        } else if (checkIfItsBetween(hora, bloqueio.horaInicio, bloqueio.horaFim)) {
                            return true
                        }
                    }
                }
            } else {
                if (bloqueio.sala.toString() === sala._id.toString() &&
                    moment(new Date(bloqueio.dia)).isSame(props.dateSelected, 'day')) {
                    if (bloqueio.wholeDay) {
                        return true
                    }
                }
            }
        }
        return false
    }

    return (
        <div className={'calendar_agendamentos_container'}>
            <h1>
                <span
                    onClick={() => {
                        props.selectDate(moment(props.dateSelected).subtract(1, 'day').toDate())
                    }}
                    className={'chevron_date'}
                    style={{float: 'left'}}>
                    <i className={'fa fa-chevron-left'}/>
                </span>
                {moment(props.dateSelected).locale('pt-BR').format(' DD MMMM YYYY')}
                <span
                    onClick={() => {
                        props.selectDate(moment(props.dateSelected).add(1, 'day').toDate())
                    }}
                    className={'chevron_date'}
                    style={{float: 'right'}}>
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
                        horas.map((hora, index) => (
                            <tr key={index}>
                                <td>{hora.label}</td>
                                {props.salas.map((sala, indexSala) => {
                                    let agendamentosDaSala = reservaDAO.getAgendamentosFromSala(props.agendamentos, sala);
                                    let [isOccupied, isMonthly] = [false, false];
                                    let agnd = null;
                                    agendamentosDaSala.forEach((agendamento, index) => {
                                        if ('hora_inicio' in agendamento) {
                                            if (numberIsBetween(hora.value, agendamento.hora_inicio, agendamento.hora_fim)
                                                && (moment(props.dateSelected).isSame(new Date(agendamento.data), 'day'))
                                                && !agendamento.cancelado) {
                                                isOccupied = true;
                                                agnd = agendamento;
                                            }
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
                                        } else if (checkBloqueado(props.bloqueiosSalas, sala, hora.value)) {
                                            return <td className={'alugado'} key={indexSala}>
                                                <i>Bloqueada</i>
                                            </td>
                                        } else {
                                            return (
                                                <td key={indexSala} className={'free'} onClick={() => {
                                                    props.openModal(ModalTypes.adicionarAgendamentoAdm);
                                                    props.selectSala(sala);
                                                }}>
                                                    <i className={'fa fa-plus'}/>
                                                </td>
                                            )
                                        }
                                    } else if (agnd) {
                                        if (isMonthly) {
                                            return (<td key={indexSala} className={'occupied'}>
                                                {agnd ? (agnd.profissional ? agnd.profissional.nome :
                                                    <i>Usuário Excluído</i>) : ''}
                                            </td>)
                                        } else {
                                            if (agnd.hora_inicio === hora.value) {
                                                return (<td
                                                    onClick={() => {
                                                        props.openModal(ModalTypes.editarAgendamento);
                                                        props.selectAgendamentos(agnd);
                                                    }}
                                                    key={indexSala}
                                                    rowSpan={agnd.hora_fim - agnd.hora_inicio}
                                                    className={'occupied'}>
                                                    {agnd ? (agnd.profissional ? agnd.profissional.nome :
                                                        <i>Usuário Excluído</i>) : ''}
                                                </td>)
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
