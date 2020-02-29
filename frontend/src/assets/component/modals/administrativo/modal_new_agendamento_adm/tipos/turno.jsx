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
        label: '08:00h às 13:00h', value: '08:00h às 13:00h',
    }, {
        label: '14:00h às 18:00h', value: '14:00h às 18:00h',
    }, {
        label: '15:00h às 19:00h', value: '15:00h às 19:00h',
    }, {
        label: '16:00h às 20:00h', value: '16:00h às 20:00h',
    }];

    return (
        <div>
            <div className={'select_profissionais_container'}>
                <Select
                    placeholder={'Profissional'}
                    classNamePrefix={'Select'}
                    options={profissionaisOptions}/>
                <h2>Duração do Turno</h2>
                <Select
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

const mapStateToProps = state => ({
    profissionais: state.profissionais.profissionais,
});

export default connect(mapStateToProps)(Turno);