import React from 'react';
import "./styles.sass";
import PropTypes from 'prop-types';
import moment from "moment/min/moment-with-locales.min";
import {connect} from "react-redux";
import reservaDAO from "../../../DAO/reservaDAO";
import {numberToHours} from "../../AuxFunctions";

const Reserva = props => {
    return (
        <div className={'reserva'}>
            <i><h2>Reservado</h2></i>
            <h4>{numberToHours(props.reserva.hora_inicio)} ~ {numberToHours(props.reserva.hora_fim)}</h4>
        </div>
    )
}

const days = ['Dom','Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const WeekCalendar = props => {
    return (
        <div className={'container_week'}>
            <div className={'chevron'}><p><i className={'fas fa-chevron-left'}/></p></div>
            {days.map((day, index) => {

                let date = moment().locale('pt-BR').startOf('week').add(index, 'days');
                let agendamentosDaSala = reservaDAO.getAgendamentosFromSala(props.agendamentos, props.sala);
                console.log(agendamentosDaSala);

                return (
                    <div
                        key={day}
                        onClick={props.addReservaListener}
                        className={'week_day'}>
                        <h1>{day}</h1>
                        <h3>{date.format('DD/MMM')}</h3>
                        {
                            agendamentosDaSala.map(agendamento => {
                                if (date.isSame(agendamento.data, 'day')) {
                                    return <Reserva reserva={agendamento}/>
                                } else {
                                    return <></>
                                }
                            })
                        }
                        <div className={'add'}><span>+</span></div>
                    </div>
                )
            })}
            <div
                className={'chevron'}>
                <p>
                    <i className={'fas fa-chevron-right'}/>
                </p>
            </div>
        </div>
    )
}

WeekCalendar.propTypes = {
    isAdm: PropTypes.bool,
    sala: PropTypes.object,
    addReservaListener: PropTypes.func,
}

const mapStateToProps = state => ({
    agendamentos: state.agendamentos.agendamentos,
});

export default connect(mapStateToProps)(WeekCalendar);