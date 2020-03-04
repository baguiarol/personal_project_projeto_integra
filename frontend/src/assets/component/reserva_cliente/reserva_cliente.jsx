import React from 'react';
import PropTypes from 'prop-types';
import "./styles.sass";
import moment from 'moment';
import {numberToHours} from "../../AuxFunctions";

const ReservaCliente = props => {
    return (
        <div className={props.executado ? 'container_reserva_cliente executado' : 'container_reserva_cliente'}>
            <div>
                <h1>{moment(props.reserva.data).format('DD/MM/YYYY')}</h1>
                <h4>{numberToHours(props.reserva.hora_inicio)} ~ {numberToHours(props.reserva.hora_fim)}</h4>
            </div>
            <div>
                <h4>Sala</h4>
                <h1>05</h1>
            </div>
            <div>
                <h4>Situação</h4>
                <h2>{props.reserva.pago ? 'Pago' : 'Pendente'}</h2>
            </div>
        </div>
    )
}

ReservaCliente.propTypes = {
    executado: PropTypes.bool,
}

export default ReservaCliente;