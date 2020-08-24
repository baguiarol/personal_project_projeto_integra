import React from 'react';
import PropTypes from 'prop-types';
import "./styles.sass";
import Button from "../../../button/button";
import ModalParent from "../../modal_parent/modal";
import Actions from "../../../../../redux/actions/actions";
import {connect} from "react-redux";
import Options from "./tipos/options";
import moment from "moment/min/moment-with-locales";
import reservaDAO from "../../../../../DAO/reservaDAO";

const ModalAgendamentoAdm = ({show, close, mongoClient, dateSelected, salaSelected, userLogged, agendamentos, setAgendamentos}) => {

    const [selectedProfissional, selectProf] = React.useState({});
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        const form = e.target;
        const profissional = selectedProfissional;
        setLoading(true);
        const data = {
            profissional_id: profissional._id,
            hora_inicio: Number(form.hora_inicio.value),
            hora_fim: Number(form.hora_fim.value),
            sala_id: salaSelected._id,
            data: moment(dateSelected).toDate(),
            valorTotal: Number((salaSelected.valor_hora * (Number(form.hora_fim.value) - Number(form.hora_inicio.value))).toFixed(2)),
            cancelado: false,
            pago: form.sit_pagamento.value == 0,
            executado: false,
        }
        if ('_id' in selectedProfissional) {
            await reservaDAO.createHoraAvulsa(data, agendamentos, dateSelected, async () => {
                await reservaDAO.create(data, userLogged);
                let novasReservas = await reservaDAO.findAll(mongoClient);
                setAgendamentos(novasReservas)
                setLoading(false);
                alert('Adicionado com sucesso!');
                close();
            }, () => {
                alert("Erro! O horário já se encontra reservado ou horário inválido.");
                setLoading(false)
                close();
            })
        } else {
            alert('Por favor, selecione um profissional.')
            setLoading(false)
        }
    }

    return (
        <ModalParent show={show}
                     onSubmit={handleSubmit}
                     header={<header>
                         <div>
                             <h1>Adicionar Reserva</h1>
                             <h3>
                                 {moment(dateSelected).locale('pt-BR')
                                     .format('DD [de] MMMM [de] YYYY')} - {salaSelected.nome}
                             </h3>
                         </div>
                         <div className={'close_container'} onClick={close}>
                             <i className={'fa fa-times'}/>
                         </div>
                     </header>}
                     body={<div>
                         <Options selectProf={selectProf}/>
                     </div>}
                     footer={
                         <div className={'footer'}>
                             <Button loading={loading} type={'submit'} text={'Confirmar'}/>
                         </div>}/>
    )
};

ModalAgendamentoAdm.propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func
};

const mapStateToProps = state => ({
    mongoClient: state.general.mongoClient,
    dateSelected: state.general.dateSelected,
    salaSelected: state.agendamentos.salaSelected,
    userLogged: state.general.userLogged,
    agendamentos: state.agendamentos.agendamentos,
});

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch({type: Actions.closeModal}),
    setAgendamentos: agendamentos => dispatch({type: Actions.setAgendamentos, payload: agendamentos})
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalAgendamentoAdm);

