import React from 'react';
import Select from "react-select";

const HoraAvulsaCliente = props => {
    const selectOptions = (horaInicial, isHoraFinal = false) => {
        let array = [];
        for (let i = horaInicial; i < (isHoraFinal ? 21 : 20); i++) {
            array.push({label: i+':00', value: i});
        }
        return array;
    };

    const [horasFinais, setHorasFinais] = React.useState(selectOptions(8));

    return (
        <div>
            <div className={'horas_intervalo'}>
                <div>
                    <h2>Hora Inicial</h2>
                    <Select
                        onChange={e => {
                            setHorasFinais(selectOptions(e.value + 1, true));
                        }}
                        classNamePrefix={'Select'}
                        options={selectOptions(8)}/>
                </div>
                <div>
                    <h2>Hora Final</h2>
                    <Select classNamePrefix={'Select'} options={horasFinais}/>
                </div>
            </div>
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
    )
}

export default HoraAvulsaCliente;