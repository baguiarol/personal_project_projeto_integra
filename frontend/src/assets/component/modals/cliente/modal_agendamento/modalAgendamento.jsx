import React from 'react';
import PropTypes from 'prop-types';
import "./styles.sass";
import Button from "../../../button/button";
import Select from 'react-select';
import ModalParent from "../../modal_parent/modal";
import Options from "./tipos/options";

const selectOptions = [
    {label: '08:00', value: 8},
    {label: '09:00', value: 9},
]

const ModalAgendamento = ({show, close}) => {
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

export default ModalAgendamento;