import React from 'react';
import PropTypes from 'prop-types';
import "./styles.sass";
import Button from "../../../button/button";
import Select from 'react-select';
import ModalParent from "../../modal_parent/modal";
import Actions from "../../../../../redux/actions/actions";
import {connect} from "react-redux";
import HoraAvulsa from "./tipos/hora_avulsa";



const ModalAgendamentoAdm = ({show, close, profissionais}) => {

    return (
        <ModalParent show={show}
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
                         <div className={'options'}>
                             <div className={'option selected'}><p>Hora Avulsa</p></div>
                             <div className={'option'}><p>Turno</p></div>
                             <div className={'option'}><p>Mensal</p></div>
                         </div>
                         <HoraAvulsa />
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
    profissionais: state.profissionais.profissionais,
});

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch({type: Actions.closeModal}),
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalAgendamentoAdm);

