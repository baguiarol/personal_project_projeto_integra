import React from 'react';
import Select from "react-select";
import {connect} from "react-redux";
import {transformStringToReais} from "../../../../../AuxFunctions";
import moment from 'moment'

const HoraAvulsaCliente = props => {

    const eSabado = () => {
        return (props.dateSelected.getDay() === 6);
    }

    const selectOptions = (horaInicial, isHoraFinal = false) => {
        let array = [];
        for (let i = horaInicial; i < (isHoraFinal ? (eSabado() ? 13 : 21) : (eSabado() ? 12 : 20)); i++) {
            array.push({label: i + ':00', value: i});
        }
        return array;
    };
    const [horaInicial, setHoraInicial] = React.useState(0);
    const [horaFinal, setHoraFinal] = React.useState(0);
    const [horasFinais, setHorasFinais] = React.useState(selectOptions(10, true));
    const [bloqueioSelecionado, setBloqueio] = React.useState(null)

    React.useEffect(() => {
        setHoraInicial(0)
        setHoraFinal(0)
        setHorasFinais((props.dateSelected.getUTCDay() === new Date().getUTCDay())
            ? selectOptions(new Date().getHours() + 1, true)
            : selectOptions(eSabado() ? 9 : 10, true))
        setBloqueio(checkIfBlocked())
    }, [props.dateSelected, props.salaSelected])

    const checkIfBlocked = () => {
        if (Array.isArray(props.salaBloqueios) && props.salaSelected) {
            for (let bloqueio of props.salaBloqueios) {
                if (bloqueio.sala && props.salaSelected._id) {
                    if (bloqueio.sala.toString() === props.salaSelected._id.toString()
                        && moment(new Date(bloqueio.dia)).add(1, 'day').isSame(props.dateSelected, 'day'))
                        return bloqueio
                }
            }
        }
        return null;
    }

    return (
        <div>
            <div className={'horas_intervalo'}>
                <div>
                    <h2>Hora Inicial</h2>
                    <Select
                        name={'hora_inicio'}
                        value={horaInicial === 0 ? '' : {label: horaInicial + ':00', value: horaInicial}}
                        style={{width: '100px'}}
                        onChange={e => {
                            setHorasFinais((e) ? selectOptions(e.value + 1, true) : selectOptions(
                                props.dateSelected.getUTCDay() === new Date().getUTCDay())
                                ? selectOptions(new Date().getHours() + 1) : selectOptions(8)
                            )
                            setHoraInicial((e) ? e.value : 0);
                        }}
                        classNamePrefix={'Select'}
                        options={
                            //Não deixar fazer reserva um horário anterior ao que já passou.
                            (props.dateSelected.getUTCDay() === new Date().getUTCDay())
                                ? selectOptions(new Date().getHours() + 1) : selectOptions(
                                bloqueioSelecionado ? bloqueioSelecionado.horaFim
                                    : eSabado() ? 8 : 9 
                                )}/>
                </div>
                <div>
                    <h2>Hora Final</h2>
                    <Select
                        onChange={e => setHoraFinal((e) ? e.value : 0)}
                        name={'hora_fim'}
                        value={horaFinal === 0 ? '' : {label: horaFinal + ':00', value: horaFinal}}
                        classNamePrefix={'Select'} options={horasFinais}/>
                </div>
            </div>
            <div>
                {bloqueioSelecionado ?
                    <p style={{textAlign: 'center', color: '#888'}}><b>Atenção</b>, a sala estará indisponível nesse
                        dia das {bloqueioSelecionado.horaInicio}h às {bloqueioSelecionado.horaFim}h</p> : <></>}
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
    salaBloqueios: state.salas.bloqueiosSalas,
})

export default connect(mapStateToProps)(HoraAvulsaCliente);
