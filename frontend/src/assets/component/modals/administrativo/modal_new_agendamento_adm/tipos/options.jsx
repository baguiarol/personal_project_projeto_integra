import React from 'react';
import HoraAvulsa from "./hora_avulsa";
import Turno from "./turno";

const Options = () => {

    const [selectedPage, selectPage] = React.useState('Hora Avulsa');
    const renderPage = page => {
        switch (page) {
            case 'Hora Avulsa':
                return (<HoraAvulsa/>);
            case 'Turno':
                return (<Turno/>);
            case 'Mensal':
                return (<></>);
            default:
                return (<></>);
        }
    }
    return (
        <div>
            <div className={'options'}>
                <div
                    onClick={() => selectPage('Hora Avulsa')}
                    className={(selectedPage === 'Hora Avulsa')
                        ? 'option selected' : 'option'}>
                    <p>Hora Avulsa</p>
                </div>
                <div
                    onClick={() => selectPage('Turno')}
                    className={(selectedPage === 'Turno') ?
                        'option selected' : 'option'}>
                    <p>Turno</p>
                </div>
                <div
                    onClick={() => selectPage('Mensal')}
                    className={(selectedPage === 'Mensal') ?
                        'option selected' : 'option'}>
                    <p>Mensal</p>
                </div>
            </div>
            {renderPage(selectedPage)}
        </div>
    );
}

export default Options;