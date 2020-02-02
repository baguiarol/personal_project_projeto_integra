import React from 'react';
import Button from "../button/button";
import "./styles.sass";
import WeekCalendar from "../week_calendar/calendar";

const Sala = props => {
    return (
        <div className={'sala_content'}>
            <div className={'sala_container'}>
            <div>
                <h1>Sala 01</h1>
                 <p>Horários Reservados</p>
            </div>
            <div>
                <Button width={'25%'} text={'Detalhes'} />
            </div>
            </div>
            <WeekCalendar />

        </div>
    )
};

export default Sala;
