import React from 'react';
import {connect} from "react-redux";
import Select from "react-select";

const Turno = props => {

    const [profissionaisOptions, setProfissionaisOptions] = React.useState([]);

    React.useEffect(() => {
        let array = [];
        props.profissionais.forEach(prof => {
            array.push({label: prof.nome, value: prof})
        });
        setProfissionaisOptions(array);
    }, [props.profissionais]);

    const optionsTurno = [{
        label: '09:00h às 13:00h', value: '09:00h às 13:00h', horaInicial: 9, horaFinal: 13,
    }, {
        label: '14:00h às 18:00h', value: '14:00h às 18:00h', horaInicial: 14, horaFinal: 18,
    }, {
        label: '15:00h às 19:00h', value: '15:00h às 19:00h', horaInicial: 15, horaFinal: 19,
    }, {
        label: '16:00h às 20:00h', value: '16:00h às 20:00h', horaInicial: 16, horaFinal: 20,
    }];

    return (
        <div>
            <div className={'select_profissionais_container'}>
                <Select
                    placeholder={'Profissional'}
                    onChange={e => props.selectProf(e.value)}
                    classNamePrefix={'Select'}
                    options={profissionaisOptions}/>
                <h2>Duração do Turno</h2>
                <Select
                    onChange={e => {
                        props.setHoraFinal(e.horaFinal);
                        props.setHoraInicial(e.horaInicial);
                    }}
                    placeholder={'Selecione o Horário do Turno'}
                    options={optionsTurno}/>
                <Select name={'sit_pagamento'}
                        classNamePrefix={'Select'}
                        options={
                            [{
                                label: 'Pago',
                                value: 0,
                            }, {
                                label: 'Pendente',
                                value: 1,
                            }, {
                                label: 'Em aberto',
                                value: 2,
                            }]}/>
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

const mapStateToProps = state => ({
    profissionais: state.profissionais.profissionais,
});

export default connect(mapStateToProps)(Turno);