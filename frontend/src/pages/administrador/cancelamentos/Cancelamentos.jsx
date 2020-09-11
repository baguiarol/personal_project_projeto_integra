import React from 'react';
import "./Cancelamentos.sass"
import AdministradorTopbar from "../../../assets/component/adm_topbar/adm_topbar";
import {connect} from "react-redux";
import {Redirect} from "react-router";
import PropTypes from 'prop-types'
import moment from 'moment/min/moment-with-locales'

const Cancelamento = ({agendamento}) => {
    if ('profissional' in agendamento) {
        return (
            <div className={'cancelamento'}>
                <div>
                    <h1>{agendamento.profissional.nome}</h1>
                    <h2>{moment(new Date(agendamento.data)).locale('pt-BR').format('ll')},
                        &nbsp;
                        {agendamento.hora_inicio}:00 às {agendamento.hora_fim}:00</h2>
                </div>
                <div>
                    <h1>Sala 03</h1>
                </div>
            </div>
        )
    } else {
        return <></>
    }
}

Cancelamento.propTypes = {
    agendamento: PropTypes.object.isRequired,
}

const Cancelamentos = props => {

    React.useEffect(() => {
        console.log(props.agendamentos)
    })

    if ('nome' in props.userLogged) {
        return (
            <div>
                <AdministradorTopbar pageSelected={'cancelamentos'} />
                <div className={'cancelamentos_container'}>
                    {
                        props.agendamentos.reverse().map(agendamento => {
                            if (agendamento.cancelado && 'profissional' in agendamento) {
                                return (<Cancelamento
                                    key={agendamento._id.toString()}
                                    agendamento={agendamento}/>)
                            } else {
                                return <></>
                            }
                        })
                    }
                </div>
            </div>
        );
    } else { return <Redirect to={'/'} /> }
}

const mapStateToProps = state => ({
    userLogged: state.general.userLogged,
    agendamentos: state.agendamentos.agendamentos,
})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Cancelamentos);