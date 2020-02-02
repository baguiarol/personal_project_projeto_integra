import React from 'react';
import "./styles.sass";

const days = new Array(7).fill(0);

const WeekCalendar = props => {
    return (
        <div className={'container_week'}>
            {days.map(day => (
                <div className={'week_day'}>
                    <h1>Seg</h1>
                    <h3>29/Jan</h3>
                    <div><span>+</span></div>
                </div>
            ))}
        </div>
    )
}

export default WeekCalendar;