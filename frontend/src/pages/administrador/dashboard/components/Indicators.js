import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

const Indicators = props => {
    const [agendamentosPendentes, setAgendamentosPendentes] = React.useState([]);
    const [agendamentosNaoCancelados, setAgendamentosNaoCancelados] = React.useState([]);
    const [agendamentosCancelados, setAgendamentosCancelados] = React.useState([]);

    React.useEffect(() => {
        let agendamentos_nao_cancelados = []
        let AgendamentosCancelados = [];
        for (let i = 0; i < props.agendamentos.length;i++) {
            if(!props.agendamentos[i].cancelado && props.agendamentos[i].executado){
                agendamentos_nao_cancelados.push(props.agendamentos[i]);
            } else if (props.agendamentos[i].cancelado) {
                AgendamentosCancelados.push(props.agendamentos[i])
            }
        }
        setAgendamentosCancelados(AgendamentosCancelados);
        setAgendamentosPendentes(agendamentos_nao_cancelados)
    }, [props.agendamentos]);

    return (
        <div className={'indicators_container'}>
            <div>
                <h5>5,25% <i className={'fa fa-arrow-up'}/> &nbsp; que no mês anterior</h5>
                <h2>{agendamentosPendentes.length} reservas no mês</h2>
            </div>
            <div>
                <h2>{agendamentosCancelados.length} reservas canceladas</h2>
                <h5>5,25% <i className={'fa fa-arrow-up'}/> &nbsp; que no mês anterior</h5>
            </div>
        </div>
    )
}

Indicators.propTypes = {}

const mapStateToProps = state => ({
    agendamentos: state.agendamentos.agendamentos,
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Indicators)