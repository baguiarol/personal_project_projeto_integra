import React from 'react';
import PropTypes from 'prop-types';
import "./CalendarAgendamentos.sass";
import {connect} from "react-redux";
import Actions from "../../../redux/actions/actions";
import ModalTypes from "../../modal_types";
import {numberIsBetween} from "../../AuxFunctions";
import reservaDAO from "../../../DAO/reservaDAO";
import moment from "moment/min/moment-with-locales";

const fillHoras = () => {
    let array = [];
    for (let i = 0; i < 13; i++)
        array.push({label: i + 8 + ':00', value: i + 8});
    return array;
}

const horas = fillHoras();
const salas = new Array(8).fill('Sala 02');

const CalendarAgendamentos = props => {
    return (
        <div className={'calendar_agendamentos_container'}>
            <h1>
                <span
                    onClick={() => {
                        props.selectDate(moment(props.dateSelected).subtract(1, 'day'))
                    }}
                    className={'chevron_date'}
                    style={{float: 'left'}}>
                    <i className={'fa fa-chevron-left'}/>
                </span>
                {moment(props.dateSelected).locale('pt-BR').format(' DD MMMM YYYY')}
                <span
                    onClick={() => {
                        props.selectDate(moment(props.dateSelected).add(1, 'day'))
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
                                    agendamentosDaSala.forEach(agendamento => {
                                        if ('hora_inicio' in agendamento) {
                                            if (numberIsBetween(hora.value, agendamento.hora_inicio, agendamento.hora_fim)
                                                && (moment(props.dateSelected).isSame(new Date(agendamento.data), 'day'))
                                                && !agendamento.cancelado) {
                                                isOccupied = true;
                                                agnd = agendamento;
                                                console.log(agnd);
                                            }
                                        } else if ('mes' in agendamento) {
                                            isMonthly = true;
                                        }
                                    });
                                    if (!isOccupied) {
                                        if (isMonthly) {
                                            return (<td key={indexSala} className={'alugado'}>
                                                    <i>Alugado Mensalmente</i>
                                            </td>)
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
                                                return (<td key={indexSala} rowSpan={agnd.hora_fim - agnd.hora_inicio} className={'occupied'}>
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
});

const mapDispatchToProps = dispatch => ({
    selectDate: date => dispatch({type: Actions.selectDate, payload: date}),
    openModal: open => dispatch({type: Actions.showModal, payload: open}),
    selectSala: sala => dispatch({type: Actions.selectSala, payload: sala}),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarAgendamentos);