import React from 'react';
import PropTypes from 'prop-types';
import "./CalendarAgendamentos.sass";

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
                <span style={{float: 'left'}}><i className={'fa fa-chevron-left'}/> </span>
                17 de Fevereiro de 2020
                <span style={{float: 'right'}}><i className={'fa fa-chevron-right'}/> </span>
            </h1>
            <table className={'calendar_table'}>
                {/*aqui vai a numeracao das salas*/}
                <thead>
                    <tr>
                        <td></td>
                        {
                            salas.map(sala => <td>{sala}</td>)
                        }
                    </tr>
                </thead>
                <tbody>
                {
                    horas.map(hora => (
                        <tr>
                            <td>{hora}</td>
                            { salas.map(sala => {
                                if (Math.round(Math.random())) {
                                    return (
                                        <td className={'free'}>
                                        <i className={'fa fa-plus'}/>
                                        </td>
                                    )
                                } else {
                                    return (<td className={'occupied'}>
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
    )
}

export default CalendarAgendamentos;