import React from 'react';
import PropTypes from 'prop-types';
import "./styles.sass";
import Button from "../../../button/button";
import Select from 'react-select';
import ModalParent from "../../modal_parent/modal";
import Actions from "../../../../../redux/actions/actions";
import {connect} from "react-redux";
import HoraAvulsa from "./tipos/hora_avulsa";
import Options from "./tipos/options";



const ModalAgendamentoAdm = ({show, close}) => {

    const handleSubmit = e => {
        e.preventDefault();
        const form = e.target;
        const profissional = e.target.value;
        alert(JSON.stringify({
            profissional_id: profissional,
            hora_inicio: form.hora_inicio.value,
            hora_fim: form.hora_fim.value,
        }));
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
                         <Options />
                     </div>}
                     footer={
                         <div className={'footer'}>
                             <Button text={'Confirmar'}/>
                         </div>}/>
    )
};

ModalAgendamentoAdm.propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func
};

const mapStateToProps = state => ({
    mongoClient: state.general.mongoClient,
});

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch({type: Actions.closeModal}),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalAgendamentoAdm);

