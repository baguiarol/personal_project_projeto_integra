import React from 'react';
import {connect} from "react-redux";
import Select from "react-select";
import moment from "moment/min/moment-with-locales";

const Mensal = props => {

    const [profissionaisOptions, setProfissionaisOptions] = React.useState([]);
    const [optionsMes, setOptionMes] = React.useState([]);

    React.useEffect(() => {
        let array = [];
        props.profissionais.forEach(prof => {
            array.push({label: prof.nome, value: prof})
        });
        let meses = [];
        for (let i = 0; i < 3; i++)
            meses.push({
                label: moment(new Date()).locale('pt-BR').add(i, 'month').format(' MMMM / YYYY'),
                value: moment(new Date()).locale('pt-BR').add(i, 'month').format(' MMMM / YYYY'),
            });
        setOptionMes(meses);
        setProfissionaisOptions(array);
    }, [props.profissionais]);

    return (
        <div>
            <div className={'select_profissionais_container'}>
                <Select
                    style={{marginLeft: '5%', marginRight: '5%'}}
                    placeholder={'Profissional'}
                    options={profissionaisOptions}/>
                    <h2>Mês a ser Solicitado</h2>
                <Select
                    style={{marginLeft: '5%', marginRight: '5%'}}
                    placeholder={'Mês a ser solicitado'}
                    options={optionsMes}/>
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

const mapStateToProps = state => ({
    profissionais: state.profissionais.profissionais,
})

export default connect(mapStateToProps)(Mensal);