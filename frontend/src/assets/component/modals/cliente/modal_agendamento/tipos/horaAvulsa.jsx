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
        for (let i = horaInicial; i < (isHoraFinal ? (eSabado() ? 13 : 21 ) : (eSabado() ? 12 : 20)); i++) {
            array.push({label: i+':00', value: i});
        }
        return array;
    };
    const [horaInicial, setHoraInicial] = React.useState(0);
    const [horaFinal, setHoraFinal] = React.useState(0);
    const [horasFinais, setHorasFinais] = React.useState(selectOptions(8, true));

    React.useEffect(() => {
        setHoraInicial(0)
        setHoraFinal(0)
        setHorasFinais((props.dateSelected.getUTCDay() === new Date().getUTCDay())
            ? selectOptions(new Date().getHours()+1, true) : selectOptions(8, true))
    }, [props.dateSelected])

    return (
        <div>
            <div className={'horas_intervalo'}>
                <div>
                    <h2>Hora Inicial</h2>
                    <Select
                        name={'hora_inicio'}
                        value={horaInicial === 0 ?  '' : {label: horaInicial+':00', value: horaInicial}}
                        style={{width: '100px'}}
                        onChange={e => {
                            setHorasFinais((e) ? selectOptions(e.value + 1, true) : selectOptions(
                                props.dateSelected.getUTCDay() === new Date().getUTCDay())
                                ? selectOptions(new Date().getHours()+1) : selectOptions(9)
                            )
                            setHoraInicial((e) ? e.value : 0);
                        }}
                        classNamePrefix={'Select'}
                        options={
                            //Não deixar fazer reserva um horário anterior ao que já passou.
                            (props.dateSelected.getUTCDay() === new Date().getUTCDay())
                                ? selectOptions(new Date().getHours() + 1) : selectOptions(9)}/>
                </div>
                <div>
                    <h2>Hora Final</h2>
                    <Select
                        onChange={e => setHoraFinal((e) ? e.value : 0)}
                        name={'hora_fim'}
                        value={horaFinal === 0 ?  '' : {label: horaFinal+':00', value: horaFinal}}
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
                    <h3>{transformStringToReais(horaFinal === 0 ? 0 : props.salaSelected.valor_hora * (horaFinal - horaInicial))}</h3>
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
