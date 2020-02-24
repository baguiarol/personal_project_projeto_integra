import React from 'react';
import PropTypes from 'prop-types';
import "./CalendarAgendamentos.sass";
import {connect} from "react-redux";
import Actions from "../../../redux/actions/actions";
import ModalTypes from "../../modal_types";

const fillHoras = () => {
    let array = [];
    for (let i = 0; i < 13; i++)
        array.push(i + 8 + ':00');
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
                            <td>{hora}</td>
                            { props.salas.map((sala, index) => {
                                if (true) {
                                    return (
                                        <td key={index} className={'free'} onClick={() => props.openModal(ModalTypes.adicionarAgendamentoAdm)}>
                                        <i className={'fa fa-plus'}/>
                                        </td>
                                    )
                                } else {
                                    return (<td key={index} className={'occupied'}>
                                        Igor Nogueira
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
});

const mapDispatchToProps = dispatch => ({
    openModal: open => dispatch({type: Actions.showModal, payload: open}),
});

export default connect(mapStateToProps, mapDispatchToProps)(CalendarAgendamentos);