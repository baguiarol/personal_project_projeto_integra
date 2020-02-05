import React from 'react';
import PropTypes from 'prop-types';
import "./styles.sass";

const ReservaCliente = props => {
    return (
        <div className={props.executado ? 'container_reserva_cliente executado' : 'container_reserva_cliente'}>
            <div>
                <h1>27/01/2019</h1>
                <h4>14:00 ~ 16:00</h4>
            </div>
            <div>
                <h4>Sala</h4>
                <h1>05</h1>
            </div>
            <div>
                <h4>Situação</h4>
                <h2>Pendente</h2>
            </div>
        </div>
    )
}

ReservaCliente.propTypes = {
    executado: PropTypes.bool,
}

export default ReservaCliente;