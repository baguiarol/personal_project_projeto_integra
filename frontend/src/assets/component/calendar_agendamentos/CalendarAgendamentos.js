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
                            salas.map((sala, index) => <td key={index}>{sala}</td>)
                        }
                    </tr>
                </thead>
                <tbody>
                {
                    horas.map((hora, index) => (
                        <tr key={index}>
                            <td>{hora}</td>
                            { salas.map((sala, index) => {
                                if (Math.round(Math.random())) {
                                    return (
                                        <td key={index} className={'free'}>
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

export default CalendarAgendamentos;