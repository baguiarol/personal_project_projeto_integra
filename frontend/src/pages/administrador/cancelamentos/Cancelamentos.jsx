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
                    <h1>{agendamento.sala.nome}</h1>
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

    const [pages, setPages] = React.useState([])
    const [selectedPage, setPage] = React.useState(1)
    const [cancelados, putCancelados] = React.useState([]);

    React.useEffect(() => {
        if (props.agendamentos) {
            putCancelados(getCancelados(props.agendamentos))
        }
    }, [props.agendamentos])

    React.useEffect(() => {
        setPages(Array.from(Array(Math.ceil(cancelados.length / 15)), (_, i) => i + 1))
    }, [cancelados])

    const getCancelados = agendamentos => {
        let array = [];
        agendamentos.forEach((el) => el.cancelado ? array.push(el) : null)
        array.filter((a,b) => {
            if (moment(new Date(a.data)).isBefore(new Date(b.data))) {
                return 1;
            } else {
                return -1;
            }
        })
        return array;
    }

    if ('nome' in props.userLogged) {
        return (
            <div>
                <AdministradorTopbar pageSelected={'cancelamentos'} />
                <div className={'cancelamentos_container'}>
                    {
                        cancelados.reverse().map((agendamento, index) => {
                            if ('profissional' in agendamento &&
                                index < (15 * selectedPage) && (index > (15 * (selectedPage - 1)))) {
                                return (<Cancelamento
                                    key={agendamento._id.toString()}
                                    agendamento={agendamento}/>)
                            } else {
                                return <></>
                            }
                        })
                    }
                    <div className={'pages'}>
                        {pages.map((page, index) => ((index < selectedPage + 5 && (index > selectedPage - 5)) || index === pages.length - 1) ? <div
                            className={page === selectedPage ? 'page selected': 'page'}
                            onClick={() => {
                                setPage(page)
                            }}>
                            {page}
                        </div> : <></>)}
                    </div>
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