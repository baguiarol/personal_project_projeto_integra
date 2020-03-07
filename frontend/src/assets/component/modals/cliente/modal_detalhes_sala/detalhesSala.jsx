import React from 'react';
import PropTypes from 'prop-types';
import ModalParent from "../../modal_parent/modal";
import "./styles.sass";
import {connect} from "react-redux";
import {transformStringToReais} from "../../../../AuxFunctions";

const ModalDetalhesSala = props => {


    const renderImage = () => {
        if ('fotos' in props.salaSelected)
        {
            return (
                <div className={'carrousel'}>
                    <i className={'fa fa-chevron-left'}/>
                    {props.salaSelected ? <img alt={''} src={props.salaSelected.fotos[0]}/> : <></>}
                    <i className={'fa fa-chevron-right'}/>
                </div>
            )
        } else {
            return <></>
        }
    };

    return (
        <ModalParent
            show={props.show}
            header={<header>
                <h1>Detalhes - {props.salaSelected.nome}</h1>
                <div className={'close_container'} onClick={props.close}>
                    <i className={'fa fa-times'}/>
                </div>
            </header>}
            body={<div className={'modal_sala_body'}>
                    {renderImage()}
                <div className={'sala_details'}>
                    <div>
                        <h2>Valor/Hora:</h2>
                        <h3>{transformStringToReais(props.salaSelected.valor_hora)}</h3>
                    </div>
                    <div>
                        <h2>No espaço contém:</h2>
                        <h3>{props.salaSelected.descricao}</h3>
                    </div>
                </div>
            </div>}
        />
    )
};

ModalDetalhesSala.propTypes = {
    sala: PropTypes.object,
}

const mapStateToProps = state => ({
    salaSelected: state.salas.salaSelected,
})

export default connect(mapStateToProps)(ModalDetalhesSala);