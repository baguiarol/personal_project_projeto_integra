import React from 'react';
import "./styles.sass";
import {connect} from "react-redux";

const Snack = props => {

    const getReservasAgendadas = () => {
        let count = 0;
        props.profissionalReservas.forEach(reserva => {
            if (!reserva.cancelado && !reserva.executado)
                count++;
        })
        return count;
    }
    return (
        <div className={'snack_container'}>
            <h2>Você tem {getReservasAgendadas()} reservas agendadas</h2>
        </div>)
}

const mapStateToProps = state => ({
    profissionalReservas: state.profissionais.profissionalReservas,
})

export default connect(mapStateToProps)(Snack);