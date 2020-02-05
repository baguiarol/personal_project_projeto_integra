import React from 'react';
import Button from "../button/button";
import "./styles.sass";
import WeekCalendar from "../week_calendar/calendar";
import PropTypes from 'prop-types';

const Sala = props => {
    return (
        <div className={'sala_content'}>
            <div className={'sala_container'}>
            <div>
                <h1>Sala 01</h1>
                 <p>Horários Reservados</p>
            </div>
            <div>
                <Button
                    width={'25%'}
                    text={'Detalhes'}
                    onClick={props.onClickDetalhesListener} />
            </div>
            </div>
            <WeekCalendar addReservaListener={props.addReservaListener}/>

        </div>
    )
};

Sala.propTypes = {
    addReservaListener: PropTypes.func,
    onClickDetalhesListener: PropTypes.func,
}

export default Sala;
