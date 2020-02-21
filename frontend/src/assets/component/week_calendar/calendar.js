import React from 'react';
import "./styles.sass";
import PropTypes from 'prop-types';

const Reserva = props => {
    return (
        <div className={'reserva'}>
            <i><h2>Reservado</h2></i>
            <h4>15:00 ~ 16:00</h4>
        </div>
    )
}

const ReservaAdm = props => {
    return (
        <div className={'reserva'}>
            <i><h4>Reservado</h4></i>
            <h3>Igor Nogueira</h3>
            <h4>15:00 ~ 16:00</h4>
        </div>
    )
}

const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

const WeekCalendar = props => {
    return (
        <div className={'container_week'}>
            <div className={'chevron'}><p><i className={'fas fa-chevron-left'}/></p></div>
            {days.map((day) => (
                <div
                    key={day}
                    onClick={props.addReservaListener}
                    className={'week_day'}>
                    <h1>{day}</h1>
                    <h3>29/Jan</h3>
                    {!props.isAdm ? <Reserva /> : <ReservaAdm /> }
                    <div className={'add'}><span>+</span></div>
                </div>
            ))}
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
    addReservaListener: PropTypes.func,
}

export default WeekCalendar;