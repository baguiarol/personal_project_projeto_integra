import React from 'react';
import PropTypes from 'prop-types';
import "./styles.sass";
import Button from "../../../button/button";
import ModalParent from "../../modal_parent/modal";
import Options from "./tipos/options";
import {connect} from "react-redux";
import moment from "moment/min/moment-with-locales";
import reservaDAO from "../../../../../DAO/reservaDAO";
import Actions from "../../../../../redux/actions/actions";

const ModalAgendamento = ({show, close, dateSelected, userLogged, salaSelected, setAgendamentos, mongoClient}) => {

        const [loading, setLoading] = React.useState(false);

        const handleSubmit = async e => {
                e.preventDefault();
                const form = e.target;
                setLoading(true);
                let data = {
                    profissional_id: userLogged._id,
                    hora_inicio: Number(form.hora_inicio.value),
                    hora_fim: Number(form.hora_fim.value),
                    sala_id: salaSelected._id,
                    data: dateSelected,
                    valorTotal: Number((salaSelected.valor_hora * (Number(form.hora_fim.value) - Number(form.hora_inicio.value))).toFixed(2)),
                    cancelado: false,
                    pago: false,
                    executado: false,
                };
                await reservaDAO.create(data, userLogged);
                setLoading(false);
                alert('Adicionado com sucesso!');
                close();
            };

        React.useEffect(() => {
            reservaDAO.findAll(mongoClient).then(res => {
                setAgendamentos(res);
            })
        })

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
                             <Options/>
                         </div>}
                         footer={
                             <div className={'footer'}>
                                 <Button loading={loading} type={'submit'} text={'Confirmar'}/>
                             </div>}/>
        )
    }
;

ModalAgendamento.propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func
}

const mapStateToProps = state => ({
    dateSelected: state.general.dateSelected,
    salaSelected: state.salas.salaSelected,
    userLogged: state.general.userLogged,
    mongoClient: state.general.mongoClient,
});

const mapDispatchToProps = dispatch => ({
    setAgendamentos: agendamentos => dispatch({type: Actions.setAgendamentos, payload: agendamentos}),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalAgendamento);