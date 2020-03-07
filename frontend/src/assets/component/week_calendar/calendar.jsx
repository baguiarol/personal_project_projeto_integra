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

    const [agendamentosDaSala, setAgendamentosDaSala] = React.useState([]);
    const [selectedDate, selectDate] = React.useState(moment());

    React.useEffect(() => {
        setAgendamentosDaSala(reservaDAO.getAgendamentosFromSala(props.agendamentos, props.sala));
    }, [props]);

    return (
        <div className={'container_week'}>
            <div
                onClick={() => {
                    setAgendamentosDaSala(reservaDAO.getAgendamentosFromSala(props.agendamentos, props.sala));
                    selectDate(selectedDate.subtract(1, 'week'));
                }}
                className={selectedDate.isSame(new Date(), 'week') ? 'chevron hidden' : 'chevron'}>
                <p>
                    <i className={'fas fa-chevron-left'}/>
                </p>
            </div>
            {days.map((day, index) => {

                let date = moment(selectedDate.toDate()).locale('pt-BR').startOf('week').add(index, 'days');

                return (
                    <div
                        key={day}
                        className={'week_day'}>
                        <h1 className={date.isSame(new Date(), 'day') ? 'today': ''}>{day}</h1>
                        <h3 className={date.isSame(new Date(), 'day') ? 'today': ''}>{date.format('DD/MMM')}</h3>
                        {
                            agendamentosDaSala.map((agendamento, index) => {
                                if (date.isSame(agendamento.data, 'day') && !agendamento.cancelado) {
                                    if ('mes' in agendamento) {
                                        return (
                                            <div
                                                onClick={() => props.addReservaListener(date)}
                                                className={'add'}>
                                                <span>+</span>
                                            </div>
                                        )
                                    }
                                    return <Reserva key={index} reserva={agendamento}/>
                                } else {
                                    return <></>
                                }
                            })
                        }
                        {
                            date.isSameOrAfter(new Date(), 'day') ?
                            (<div
                            onClick={() => props.addReservaListener(date)}
                            className={'add'}>
                            <span>+</span>
                            </div>) : <></>
                        }

                    </div>
                )
            })}
            <div
                onClick={() => {
                    setAgendamentosDaSala(reservaDAO.getAgendamentosFromSala(props.agendamentos, props.sala));
                    selectDate(selectedDate.add(1, 'week'));
                }}
                className={selectedDate.isSame(moment().add(2, 'week'), 'week') ? 'chevron hidden' : 'chevron'}>
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