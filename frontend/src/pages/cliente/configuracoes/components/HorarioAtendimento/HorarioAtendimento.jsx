import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import "./HorarioAtendimento.sass"
import InputText from "../../../../../assets/component/inputText/input";
import Button from "../../../../../assets/component/button/button";
import DiaAtendimento from "../DiaAtendimento/DiaAtendimento";
import clienteDAO from "../../../../../DAO/clienteDAO";

const HorarioAtendimento = props => {

    const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const [atendimentos, setAtendimentos] = React.useState({
        Seg: [],
        Ter: [],
        Qua: [],
        Qui: [],
        Sex: [],
        Sab: [],
    });
    const [loading, setLoading] = React.useState(false);

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        const form = e.target;
        let data = {horarios: atendimentos}
        if (form.valor.value !== '') {
            data = {...data, valorAtendimento: form.valor.value}
        }
        await clienteDAO.update({_id: props.userLogged._id}, data);
        setLoading(false);
    }

    React.useEffect(() => {
        if (props.userLogged) {
            if ('horarios' in props.userLogged) {
                setAtendimentos(props.userLogged.horarios);
            }
        }
    }, [props.userLogged]);

    return (
        <div>
            <form onSubmit={onSubmit}>
                <InputText
                    defaultValue={props.userLogged.valorAtendimento}
                    label={'Valor do Atendimento Inicial'}
                    type={'number'}
                    name={'valor'}
                    style={{width: '23%'}}/>
                <div className={'horario_atendimento'}>
                    <div className={'column'}>
                        {dias.map((dia, index) => index < 3 ? (
                            <DiaAtendimento
                                dia={dia}
                                setAtendimentos={(novosAtendimentos) =>
                                    setAtendimentos(novosAtendimentos)}
                                atendimentos={atendimentos} />
                        ) : <></>)}
                    </div>
                    <div className={'column'}>
                        {dias.map((dia, index) => index >= 3 ? (
                            <DiaAtendimento
                                dia={dia}
                                setAtendimentos={(novosAtendimentos) =>
                                    setAtendimentos(novosAtendimentos)}
                                atendimentos={atendimentos} />
                        ) : <></>)}
                    </div>
                </div>
                <br />
                <Button loading={loading} text={'Salvar Horários'} width={'300px'}/>
            </form>
        </div>
    )
}

HorarioAtendimento.propTypes = {}

const mapStateToProps = state => ({
    userLogged: state.general.userLogged,
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(HorarioAtendimento)