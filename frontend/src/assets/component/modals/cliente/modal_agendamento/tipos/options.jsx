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

    return (
        <div>
            {/*<div className={'options'}>*/}
            {/*    <div*/}
            {/*        onClick={() => selectPage('Hora Avulsa')}*/}
            {/*        className={(selectedPage === 'Hora Avulsa')*/}
            {/*            ? 'option selected' : 'option'}>*/}
            {/*        <p>Hora Avulsa</p>*/}
            {/*    </div>*/}
            {/*    <div*/}
            {/*        onClick={() => selectPage('Turno')}*/}
            {/*        className={(selectedPage === 'Turno') ?*/}
            {/*            'option selected' : 'option'}>*/}
            {/*        <p>Turno</p>*/}
            {/*    </div>*/}
            {/*    <div*/}
            {/*        onClick={() => selectPage('Mensal')}*/}
            {/*        className={(selectedPage === 'Mensal') ?*/}
            {/*            'option selected' : 'option'}>*/}
            {/*        <p>Mensal</p>*/}
            {/*    </div>*/}
            {/*</div>*/}
            {renderPage(selectedPage)}
        </div>
    );
};

Options.propTypes = {
    selectedPage: PropTypes.string.isRequired,
    selectPage: PropTypes.func.isRequired,
    selectTurno: PropTypes.func.isRequired,
};

export default Options;
