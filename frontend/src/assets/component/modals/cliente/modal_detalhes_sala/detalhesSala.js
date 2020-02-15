import React from 'react';
import PropTypes from 'prop-types';
import ModalParent from "../../modal_parent/modal";
import "./styles.sass";

const ModalDetalhesSala = props => {
    return (
        <ModalParent
            show={props.show}
            header={<header>
                <h1>Detalhes - Sala 01</h1>
                <div className={'close_container'} onClick={props.close}>
                    <i className={'fa fa-times'}/>
                </div>
            </header>}
            body={<div className={'modal_sala_body'}>
                <div className={'carousel'}>
                    <i className={'fa fa-chevron-left'}/>
                        <img alt={''} src={require('../../../../sala.png')} />
                    <i className={'fa fa-chevron-right'}/>
                </div>
                <div className={'sala_details'}>
                    <div>
                        <h2>Valor/Hora:</h2>
                        <h3>R$39,90</h3>
                    </div>
                    <div>
                        <h2>No espaço contém:</h2>
                        <h3>3 cadeiras, 2 estantes, uma sala de estar e ar condicionado</h3>
                    </div>
                </div>
            </div>}
        />
    )
};

export default ModalDetalhesSala;