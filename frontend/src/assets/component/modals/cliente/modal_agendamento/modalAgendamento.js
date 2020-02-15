import React from 'react';
import PropTypes from 'prop-types';
import "./styles.sass";
import Button from "../../../button/button";
import Select from 'react-select';
import ModalParent from "../../modal_parent/modal";

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
                         <div className={'options'}>
                             <div className={'option selected'}><p>Hora Avulsa</p></div>
                             <div className={'option'}><p>Turno</p></div>
                             <div className={'option'}><p>Mensal</p></div>
                         </div>
                         <div className={'horas_intervalo'}>
                             <div>
                                 <h2>Hora Inicial</h2>
                                 <Select options={selectOptions}/>
                             </div>
                             <div>
                                 <h2>Hora Final</h2>
                                 <Select options={selectOptions}/>
                             </div>
                         </div>
                         <div className={'resume_container'}>
                             <div>
                                 <h2>Valor/Hora</h2>
                                 <h3>R$39,90</h3>
                             </div>
                             <div>
                                 <h2>Valor Total:</h2>
                                 <h3>R$139,90</h3>
                             </div>
                         </div>
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