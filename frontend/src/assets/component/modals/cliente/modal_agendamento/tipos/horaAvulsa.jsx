import React from 'react';
import Select from "react-select";
import {connect} from "react-redux";
import {transformStringToReais} from "../../../../../AuxFunctions";

const HoraAvulsaCliente = props => {

    const eSabado = () => {
        return (props.dateSelected.getDay() === 6);
    }

    const selectOptions = (horaInicial, isHoraFinal = false) => {
        let array = [];
        for (let i = horaInicial; i < (isHoraFinal ? (eSabado() ? 12 : 21 ) : (eSabado() ? 11 : 20)); i++) {
            array.push({label: i+':00', value: i});
        }
        return array;
    };
    const [horaInicial, setHoraInicial] = React.useState(0);
    const [horaFinal, setHoraFinal] = React.useState(0);
    const [horasFinais, setHorasFinais] = React.useState(selectOptions(8));

    return (
        <div>
            <div className={'horas_intervalo'}>
                <div>
                    <h2>Hora Inicial</h2>
                    <Select
                        name={'hora_inicio'}
                        onChange={e => {
                            setHorasFinais(selectOptions(e.value + 1, true));
                            setHoraInicial(e.value);
                        }}
                        classNamePrefix={'Select'}
                        options={selectOptions(8)}/>
                </div>
                <div>
                    <h2>Hora Final</h2>
                    <Select
                        onChange={e => setHoraFinal(e.value)}
                        name={'hora_fim'}
                        classNamePrefix={'Select'} options={horasFinais}/>
                </div>
            </div>
            <div className={'resume_container'}>
                <div>
                    <h2>Valor/Hora</h2>
                    <h3>{transformStringToReais(props.salaSelected.valor_hora)}</h3>
                </div>
                <div>
                    <h2>Valor Total:</h2>
                    <h3>{transformStringToReais(props.salaSelected.valor_hora * (horaFinal - horaInicial))}</h3>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    salaSelected: state.salas.salaSelected,
    dateSelected: state.general.dateSelected,
})

export default connect(mapStateToProps)(HoraAvulsaCliente);