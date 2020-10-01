import React from 'react';
import ModalParent from "../../modal_parent/modal";
import Button from "../../../button/button";
import {connect} from "react-redux";
import CheckBox from "../../../checkbox/checkbox";
import Moment from 'moment/min/moment-with-locales.min';
import "./EditAgendamento.sass";
import reservaDAO, {checkIfIsBetween, getStringDate} from "../../../../../DAO/reservaDAO";
import Actions from "../../../../../redux/actions/actions";
import Select from "react-select";
import {extendMoment} from "moment-range";

const moment = extendMoment(Moment)

const ModalEditAgendamento = props => {

    const [loading, setLoading] = React.useState(false);
    const [executing, setExecuting] = React.useState(false);
    const [finalizado, setFinalizado] = React.useState(false);
    const [pago, setPago] = React.useState(false);
    const [cancelamentoData, setCancelamentoData] = React.useState({
        hora_inicio: 0,
        hora_fim: 0,
        reservaInteira: false,
    })
    const [editarSala, setEditarSala] = React.useState(null);

    const setSubtitle = () => {
        if ('profissional' in props.agendamentoSelected) {
            return props.agendamentoSelected.profissional.nome + ' - ' +
                moment(props.dateSelected).locale('pt-BR').format('DD MMMM [de] YYYY')+' - '+props.agendamentoSelected.sala.nome;
        }
        return '';
    };

    const populateHorasArray = (horaInicio, horaFim) => {
        let arr = [];
        for (let i = horaInicio; i < horaFim; i++)
            arr.push({label: i + ':00', value: i})
        return arr;
    }

    const populateSalas = (salas) => {
        let arr = []
        salas.forEach(sala => arr.push({label: sala.nome, value: sala._id}));
        return arr;
    }

    React.useEffect(() => {
        setExecuting(('execucao_inicio' in props.agendamentoSelected)
            && !('execucao_fim' in props.agendamentoSelected));
        setFinalizado(('execucao_inicio' in props.agendamentoSelected)
            && ('execucao_fim' in props.agendamentoSelected));
        setCancelamentoData({
            ...cancelamentoData,
            hora_inicio: props.agendamentoSelected.hora_inicio,
            hora_fim: props.agendamentoSelected.hora_fim
        })
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
                <h2>Sala</h2>
                <Select
                    onChange={e => setEditarSala({id: e.value, label: e.label})}
                    options={populateSalas(props.salas)}/><br/>
                <Button
                        loading={loading}
                        width={'45%'}
                        style={{marginTop: 15}}
                        type={"button"}
                        text={'Trocar Sala'}
                        onClick={async () => {
                        if (editarSala) {
                            setLoading(true);
                            let agendamentos = reservaDAO.getAgendamentosFromSala(props.agendamentos, {nome: editarSala.label});
                            let r2 = moment.range(
                                new Date(getStringDate(
                                    new Date(props.agendamentoSelected.data), props.agendamentoSelected.hora_inicio)),
                                new Date(getStringDate(
                                    new Date(props.agendamentoSelected.data), props.agendamentoSelected.hora_fim)),
                            );
                            console.log("Range ", r2);
                            for (let agendamento of agendamentos) {
                                let r1 = moment.range(
                                    new Date(getStringDate(new Date(agendamento.data), agendamento.hora_inicio)),
                                    new Date(getStringDate(new Date(agendamento.data), agendamento.hora_fim)));
                                if (r1.overlaps(r2)) {
                                    alert("O horário já se encontra reservado na sala requerida.")
                                    setLoading(false)
                                    return;
                                }
                            }
                            await reservaDAO.editaReserva(props.agendamentoSelected._id,{ sala_id: editarSala.id});
                            setLoading(false);
                        }
                    }}/>
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
                            </div>
                    }
                </h3>
                <div>
                    <h2>Cancalemento</h2>
                    <CheckBox label={"Reserva Inteira"}
                              onCheck={(checked) =>
                                  setCancelamentoData({...cancelamentoData, reservaInteira: !checked})}/>
                    <div style={{display: 'flex', marginBottom: 20}}>
                        <div style={{flexGrow: 1, marginRight: 20}}>
                            <h3 style={{marginTop: 0}}>Hora Início</h3>
                            <Select
                                value={cancelamentoData.hora_inicio === 0 ? ''
                                    : {
                                        label: cancelamentoData.hora_inicio + ':00',
                                        value: cancelamentoData.hora_inicio
                                    }}
                                onChange={(e) => setCancelamentoData({...cancelamentoData, hora_inicio: e.value})}
                                options={populateHorasArray(props.agendamentoSelected.hora_inicio,
                                    props.agendamentoSelected.hora_fim)}/>
                        </div>
                        <div style={{flexGrow: 1}}>
                            <h3 style={{marginTop: 0}}>Hora Fim</h3>
                            <Select
                                value={cancelamentoData.hora_fim === 0 ? ''
                                    : {label: cancelamentoData.hora_fim + ':00', value: cancelamentoData.hora_fim}}
                                onChange={(e) => setCancelamentoData({...cancelamentoData, hora_fim: e.value})}
                                options={populateHorasArray(cancelamentoData.hora_inicio + 1,
                                    props.agendamentoSelected.hora_fim + 1)}/>
                        </div>
                    </div>
                    <Button text={'Cancelar Reserva'}
                            width={'45%'}
                            onClick={async () => {
                                if (cancelamentoData.reservaInteira) {
                                    if (window.confirm('Tem certeza que deseja cancelar toda a reserva?')) {
                                        await reservaDAO.cancelaReserva(props.agendamentoSelected._id, props.userLogged)
                                        props.close()
                                    }
                                } else {
                                    if (window.confirm(
                                        `Tem certeza que deseja cancelar a reserva das ${cancelamentoData.hora_inicio}h até às ${cancelamentoData.hora_fim}h`)) {
                                        await reservaDAO
                                            .cancelaParteDaReserva(props.agendamentoSelected._id,
                                                cancelamentoData.hora_inicio,
                                                cancelamentoData.hora_fim,
                                                props.agendamentos);
                                        props.close()
                                    }
                                }
                            }}/>
                </div>
                <h2>Pagamento</h2>
                <h3>
                    {pago ? 'Reserva já foi paga.' : 'Reserva ainda não foi paga.'} <br/><br/>
                    {pago ? <></>
                        : <Button
                            onClick={async () => {
                                setLoading(true);
                                await reservaDAO.pagaReserva(props.agendamentoSelected._id, true, props.userLogged,);
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
                            await reservaDAO.pagaReserva(props.agendamentoSelected._id, false, props.userLogged)
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
    salas: state.salas.salas,
    userLogged: state.general.userLogged,
    agendamentos: state.agendamentos.agendamentos,
});

const mapDispatchToProps = dispatch => ({
    setAgendamentos: agnds => dispatch({type: Actions.setAgendamentos, payload: agnds}),
    selectAgendamentos: agnd => dispatch({type: Actions.selectAgendamentos, payload: agnd}),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditAgendamento);
