import React from 'react';
import ModalParent from "../../modal_parent/modal";
import Button from "../../../button/button";
import {connect} from "react-redux";
import moment from 'moment/min/moment-with-locales.min';
import "./EditAgendamento.sass";
import reservaDAO from "../../../../../DAO/reservaDAO";
import Actions from "../../../../../redux/actions/actions";

const ModalEditAgendamento = props => {

    const [loading, setLoading] = React.useState(false);
    const [executing, setExecuting] = React.useState(false);
    const [finalizado, setFinalizado] = React.useState(false);
    const [pago, setPago] = React.useState(false);

    const setSubtitle = () => {
        if ('profissional' in props.agendamentoSelected) {
            return props.agendamentoSelected.profissional.nome + ' - ' +
                moment(props.dateSelected).locale('pt-BR').format('DD MMMM [de] YYYY');
        }
        return '';
    };

    React.useEffect(() => {
        setExecuting(('execucao_inicio' in props.agendamentoSelected)
            && !('execucao_fim' in props.agendamentoSelected));
        setFinalizado(('execucao_inicio' in props.agendamentoSelected)
            && ('execucao_fim' in props.agendamentoSelected));
        setPago(props.agendamentoSelected.pago);
    }, [props]);

    const updateAgendamentos = async () => {
        let agendamentos = await reservaDAO.findAll(props.mongoClient);
        props.setAgendamentos(agendamentos);
        props.selectAgendamentos(reservaDAO.getAgendamentosById(agendamentos, props.agendamentoSelected._id));
    }

    //Modal para fazer trocar pagamento, execução ou cancelar.
    return (
        <ModalParent
            show={props.show}
            header={<header>
                <div>
                    <h1>Editar Reserva</h1>
                    <h3>{setSubtitle()}</h3>
                </div>
                <div className={'close_container'} onClick={props.close}>
                    <i className={'fa fa-times'}/>
                </div>
            </header>}
            body={<div className={'body_edit_agendamento'}>
                <h2>Execução</h2>
                <h3>
                    {finalizado ? `Reserva já foi finalizada. Início às ${
                            moment(props.agendamentoSelected.execucao_inicio).format('HH:mm')
                        }, e fim às ${moment(props.agendamentoSelected.execucao_fim).format('HH:mm')}`
                        : (executing ? 'Reserva está sendo executada' : 'Reserva ainda não executada')}
                    <br/><br/>
                    {
                        finalizado ? <></> :
                            <div style={{display: 'flex'}}>
                                <Button
                                    onClick={async () => {
                                        setLoading(true);
                                        if (executing) {
                                            await reservaDAO.executaReserva(props.agendamentoSelected._id);
                                            await updateAgendamentos();
                                            alert('Execução Finalizada com Sucesso!');
                                        } else {
                                            await reservaDAO.comecaReserva(props.agendamentoSelected._id);
                                            await updateAgendamentos();
                                        }
                                        setLoading(false);
                                    }}
                                    type={'button'}
                                    text={'execucao_inicio' in props.agendamentoSelected ?
                                        'Finalizar' : 'Iniciar'
                                    }
                                    loading={loading}
                                    width={'30%'}/> &nbsp; &nbsp;
                                <Button text={'Cancelar Reserva'}
                                        width={'45%'}
                                        onClick={async () => {
                                            if (window.confirm('Tem certeza que deseja cancelar a reserva?')) {
                                                await reservaDAO.cancelaReserva(props.agendamentoSelected._id)
                                                props.close()
                                            }
                                        }}/>
                            </div>
                    }
                </h3>
                <h2>Pagamento</h2>
                <h3>
                    {pago ? 'Reserva já foi paga.' : 'Reserva ainda não foi paga.'} <br/><br/>
                    {pago ? <></>
                        : <Button
                            onClick={async () => {
                                setLoading(true);
                                await reservaDAO.pagaReserva(props.agendamentoSelected._id, true);
                                await updateAgendamentos();
                                setLoading(false);
                            }}
                            loading={loading}
                            type={'button'}
                            text={'Pagar'}
                            width={'45%'}/>}
                    {pago ?
                        <Button onClick={async () => {
                            setLoading(true);
                            await reservaDAO.pagaReserva(props.agendamentoSelected._id, false)
                            await updateAgendamentos();
                            setLoading(false)
                        }} text={'Desfazer'}
                                width={'45%'}/> : <></>}
                </h3>
            </div>}
            footer={
                <div className={'footer footer_edit_agendamento'}>
                    {'sala' in props.agendamentoSelected ?
                        <div className={'flex crud_ops'}>
                            <Button text={'Cancelar'} type={'button'} onClick={async () => {
                            }}/>
                            <Button className={'submit'} loading={loading} type={'submit'} text={'Confirmar'}/>
                        </div> : <></>}
                </div>
            }
        />
    )
};

const mapStateToProps = state => ({
    agendamentoSelected: state.agendamentos.agendamentoSelected,
    dateSelected: state.general.dateSelected,
    mongoClient: state.general.mongoClient,
});

const mapDispatchToProps = dispatch => ({
    setAgendamentos: agnds => dispatch({type: Actions.setAgendamentos, payload: agnds}),
    selectAgendamentos: agnd => dispatch({type: Actions.selectAgendamentos, payload: agnd}),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditAgendamento);
