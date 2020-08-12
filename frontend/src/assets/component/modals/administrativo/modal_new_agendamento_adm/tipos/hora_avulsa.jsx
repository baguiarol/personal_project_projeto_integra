import React from 'react';
import Select from "react-select";
import Actions from "../../../../../../redux/actions/actions";
import {connect} from "react-redux";
import {transformStringToReais} from "../../../../../AuxFunctions";

const HoraAvulsa = ({profissionais, selectProf, salaSelected, dateSelected}) => {

    const eSabado = () => {
        return (dateSelected.getDay() === 6);
    }

    const selectOptions = (horaInicial, isHoraFinal = false) => {
        let array = [];
        for (let i = horaInicial; i < (isHoraFinal ? (eSabado() ? 13 : 21 ) : (eSabado() ? 12 : 20)); i++) {
            array.push({label: i+':00', value: i});
        }
        return array;
    };


    const [profissionaisOptions, setProfissionaisOptions] = React.useState([]);
    const [horaInicial, setHoraInicial] = React.useState(0);
    const [horaFinal, setHoraFinal] = React.useState(0);
    const [horasFinais, setHorasFinais] = React.useState(selectOptions(9, true));
    let selectedOption = null;

    React.useEffect(() => {
        let array = [];
        profissionais.forEach(prof => {
            array.push({label: prof.nome, value: prof})
        });
        setProfissionaisOptions(array);
    }, [profissionais]);

    return (
        <div>
            <div className={'select_profissionais_container'}>
                <Select
                    required
                    name={'profissional'}
                    onChange={e => { selectProf(e.value) }}
                    style={{marginLeft: '5%', marginRight: '5%'}}
                    placeholder={'Profissional'}
                    options={profissionaisOptions}/>
            </div>
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
                        options={selectOptions(9)}/>
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
                    <h3>{transformStringToReais(salaSelected.valor_hora)}</h3>
                </div>
                <div>
                    <h2>Valor Total:</h2>
                    <h3>{transformStringToReais(horaFinal === 0 ? 0 : salaSelected.valor_hora * (horaFinal - horaInicial))}</h3>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    mongoClient: state.general.mongoClient,
    profissionais: state.profissionais.profissionais,
    salaSelected: state.agendamentos.salaSelected,
    dateSelected: state.general.dateSelected,
});

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch({type: Actions.closeModal}),
})

export default connect(mapStateToProps)(HoraAvulsa);
