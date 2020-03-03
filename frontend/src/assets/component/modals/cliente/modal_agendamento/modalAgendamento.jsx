import React from 'react';
import PropTypes from 'prop-types';
import "./styles.sass";
import Button from "../../../button/button";
import Select from 'react-select';
import ModalParent from "../../modal_parent/modal";
import Options from "./tipos/options";
import {connect} from "react-redux";
import moment from "moment/min/moment-with-locales";

const selectOptions = [
    {label: '08:00', value: 8},
    {label: '09:00', value: 9},
]

const ModalAgendamento = ({show, close, dateSelected}) => {
    return (
        <ModalParent show={show}
                     header={<header>
                         <div>
                             <h1>Adicionar Reserva</h1>
                             <h3>{moment(dateSelected).locale('pt-BR').format('DD [de] MMMM [de] YYYY')}</h3>
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

ModalAgendamento.propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func
}

const mapStateToProps = state => ({
    dateSelected: state.general.dateSelected,
});

const mapDispatchToProps = dispatch => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(ModalAgendamento);