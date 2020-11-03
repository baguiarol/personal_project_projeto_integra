import React from 'react';
import HoraAvulsa from "./hora_avulsa";
import Turno from "./turno";
import Mensal from "./mensal";

const Options = props => {


    const renderPage = page => {
        switch (page) {
            case 'Hora Avulsa':
                return (<HoraAvulsa selectProf={props.selectProf}/>);
            case 'Turno':
                return (<Turno
                    setHoraInicial={props.setHoraInicial}
                    setHoraFinal={props.setHoraFinal}
                    selectProf={props.selectProf} />);
            case 'Mensal':
                return (<Mensal />);
            default:
                return (<></>);
        }
    }
    return (
        <div>
            <div className={'options'}>
                <div
                    onClick={() => props.selectPage('Hora Avulsa')}
                    className={(props.selectedPage === 'Hora Avulsa')
                        ? 'option selected' : 'option'}>
                    <p>Hora Avulsa</p>
                </div>
                <div
                    onClick={() => props.selectPage('Turno')}
                    className={(props.selectedPage === 'Turno') ?
                        'option selected' : 'option'}>
                    <p>Turno</p>
                </div>
                <div
                    onClick={() => props.selectPage('Mensal')}
                    className={(props.selectedPage === 'Mensal') ?
                        'option selected' : 'option'}>
                    <p>Mensal</p>
                </div>
            </div>
            {renderPage(props.selectedPage)}
        </div>
    );
}

export default Options;