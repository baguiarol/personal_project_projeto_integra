import React from 'react';
import "./styles.sass";

const days = new Array(7).fill(0);

const Reserva = props => {
    return (
        <div className={'reserva'}>
            <i><h2>Reservado</h2></i>
            <h4>15:00 ~ 16:00</h4>
        </div>
    )
}

const WeekCalendar = props => {
    return (
        <div className={'container_week'}>
            <div className={'chevron'}><p><i className={'fas fa-chevron-left'}/></p></div>
            {days.map(day => (
                <div className={'week_day'}>
                    <h1>Seg</h1>
                    <h3>29/Jan</h3>
                    <Reserva/>
                    <div className={'add'}><span>+</span></div>
                </div>
            ))}
            <div className={'chevron'}><p><i className={'fas fa-chevron-right'}/></p></div>
        </div>
    )
}

export default WeekCalendar;