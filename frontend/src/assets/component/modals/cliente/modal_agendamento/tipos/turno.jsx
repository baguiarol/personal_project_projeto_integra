import React from 'react';
import {connect} from "react-redux";
import Select from "react-select";
import PropTypes from 'prop-types';

const TurnoCliente = props => {

    const eSabado = () => (props.dateSelected.getDay() === 6)

    const optionsTurno = eSabado() ?
        [{label: '08:00h às 12:00h', value: { hora_inicio: 8, hora_fim: 12}}]
        : [{
        label: '08:00h às 13:00h', value: {
            hora_inicio: 8,
            hora_fim: 13,
        },
    }, {
        label: '14:00h às 18:00h', value: {
            hora_inicio: 14,
            hora_fim: 18,
        },
    }, {
        label: '15:00h às 19:00h', value: {
            hora_inicio: 15,
            hora_fim: 19,
        },
    }, {
        label: '16:00h às 20:00h', value: {
            hora_inicio: 16,
            hora_fim: 20,
        },
    }];

    return (
        <div>
            <div className={'select_profissionais_container'}>
                <h2>Duração do Turno</h2>
                <Select
                    onChange={e => props.selectTurno(e.value)}
                    name={'hora_turno'}
                    placeholder={'Selecione o Horário do Turno'}
                    options={optionsTurno}/>
                <div className={'resume_container'}>
                    <div>
                        <h2>Valor/Hora</h2>
                        <h3>R$39,90</h3>
                    </div>
                    <div>
                        <h2>Valor Total:</h2>
                        <h3>R$139,90</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

TurnoCliente.propTypes = {
    selectTurno: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    profissionais: state.profissionais.profissionais,
    dateSelected: state.general.dateSelected,
});

export default connect(mapStateToProps)(TurnoCliente);
