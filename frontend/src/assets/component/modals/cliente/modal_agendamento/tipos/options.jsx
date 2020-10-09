import React from 'react';
import HoraAvulsaCliente from "./horaAvulsa";
import TurnoCliente from "./turno";
import MensalCliente from "./mensal";
import PropTypes from 'prop-types';

const Options = ({selectedPage, selectPage, selectTurno, selectMes}) => {

    const renderPage = page => {
        switch (page) {
            case 'Hora Avulsa':
                return (<HoraAvulsaCliente />);
            case 'Turno':
                return (<TurnoCliente selectTurno={selectTurno}/>);
            case 'Mensal':
                return (<MensalCliente selectMes={selectMes}/>);
            default:
                return (<></>);
        }
    };

    return renderPage(selectedPage);
};

Options.propTypes = {
    selectedPage: PropTypes.string.isRequired,
    selectPage: PropTypes.func.isRequired,
    selectTurno: PropTypes.func.isRequired,
};

export default Options;
