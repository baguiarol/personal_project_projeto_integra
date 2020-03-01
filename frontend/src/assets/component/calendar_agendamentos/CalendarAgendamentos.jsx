import React from 'react';
import PropTypes from 'prop-types';
import "./CalendarAgendamentos.sass";
import {connect} from "react-redux";
import Actions from "../../../redux/actions/actions";
import ModalTypes from "../../modal_types";
import {numberIsBetween} from "../../AuxFunctions";
import reservaDAO from "../../../DAO/reservaDAO";

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
                <span style={{float: 'left', margin: 'auto'}}><i className={'fa fa-chevron-left'}/> </span>
                17 de Fevereiro de 2020
                <span style={{float: 'right', margin: 'auto'}}><i className={'fa fa-chevron-right'}/> </span>
            </h1>
            <div className={'container_table'}>
            <table className={'calendar_table'}>
                {/*aqui vai a numeracao das salas*/}
                <thead>
                    <tr>
                        <td></td>
                        {
                            props.salas.map((sala, index) => <td key={index}>{sala.nome}</td>)
                        }
                    </tr>
                </thead>
                <tbody>
                {
                    horas.map((hora, index) => (
                        <tr key={index}>
                            <td>{hora.label}</td>
                            { props.salas.map((sala, index) => {
                                let agendamentosDaSala = reservaDAO.getAgendamentosFromSala(props.agendamentos, sala);
                                let isOccupied = false;
                                let agnd = null;
                                agendamentosDaSala.forEach(agendamento => {
                                    if (numberIsBetween(hora.value, agendamento.hora_inicio, agendamento.hora_fim)) {
                                        isOccupied = true;
                                        agnd = agendamento;
;                                    }
                                });
                                console.log(isOccupied);
                                if (!isOccupied) {
                                    return (
                                        <td key={index} className={'free'} onClick={() => {
                                            props.openModal(ModalTypes.adicionarAgendamentoAdm);
                                            props.selectSala(sala);
                                        }}>
                                            <i className={'fa fa-plus'}/>
                                        </td>
                                    )
                                } else {
                                    return (<td key={index} className={'occupied'}>
                                        {agnd ? agnd.profissional.nome: ''}
                                    </td>)
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
});

const mapDispatchToProps = dispatch => ({
    openModal: open => dispatch({type: Actions.showModal, payload: open}),
    selectSala: sala => dispatch({type: Actions.selectSala, payload: sala}),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarAgendamentos);