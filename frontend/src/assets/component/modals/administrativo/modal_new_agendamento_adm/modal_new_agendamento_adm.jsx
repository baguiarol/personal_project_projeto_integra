import React from 'react';
import PropTypes from 'prop-types';
import "./styles.sass";
import Button from "../../../button/button";
import ModalParent from "../../modal_parent/modal";
import Actions from "../../../../../redux/actions/actions";
import {connect} from "react-redux";
import Options from "./tipos/options";
import moment from 'moment';
import reservaDAO from "../../../../../DAO/reservaDAO";

const ModalAgendamentoAdm = ({show, close, dateSelected, salaSelected, userLogged}) => {

    const [selectedProfissional, selectProf] = React.useState({});
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        const form = e.target;
        const profissional = selectedProfissional;
        setLoading(true);
        await reservaDAO.create({
            profissional_id: profissional._id,
            hora_inicio: Number(form.hora_inicio.value),
            hora_fim: Number(form.hora_fim.value),
            sala_id: salaSelected._id,
            data: moment(dateSelected).toDate(),
            valorTotal: Number((salaSelected.valor_hora * (Number(form.hora_fim.value) - Number(form.hora_inicio.value))).toFixed(2)),
            cancelado: false,
            pago: false,
            executado: false,
        }, userLogged);
        setLoading(false);
        alert('Adicionado com sucesso!');
        close();
    }

    return (
        <ModalParent show={show}
                     onSubmit={handleSubmit}
                     header={<header>
                         <div>
                             <h1>Adicionar Reserva</h1>
                             <h3>Sexta, 27 de Janeiro de 2019</h3>
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
});

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch({type: Actions.closeModal}),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalAgendamentoAdm);

