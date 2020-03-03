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
                <h1>{props.sala.nome}</h1>
                 <p>Horários Reservados</p>
            </div>
            <div>
                <Button
                    className={'btn_detalhes'}
                    text={'Detalhes'}
                    onClick={props.onClickDetalhesListener} />
            </div>
            </div>
            <WeekCalendar sala={props.sala} isAdm={props.isAdm} addReservaListener={props.addReservaListener}/>
        </div>
    )
};

Sala.propTypes = {
    isAdm: PropTypes.bool,
    addReservaListener: PropTypes.func,
    onClickDetalhesListener: PropTypes.func,
}

export default Sala;
