import React from 'react';
import './styles.sass';
import Button from "../button/button";
import PropTypes from 'prop-types';
import Actions from "../../../redux/actions/actions";
import {connect} from "react-redux";
import ModalTypes from "../../modal_types";

const CardSala = props => {
    return (
        <div className={'card_sala'}>
            <img
                alt={'sala'}
                src={props.sala.fotos[0]}/>
            <div>
                <h2>{props.sala.nome}</h2>
                <Button
                    onClick={() => {
                        props.openModal(ModalTypes.adicionarSalas);
                        props.selectSala(props.sala);
                    }}
                    text={'Informações'}/>
            </div>
        </div>
    )
}

CardSala.propTypes = {
    sala: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
    openModal: type => dispatch({type: Actions.showModal, payload: type}),
    selectSala: sala => dispatch({type: Actions.selectSala, payload: sala}),
});

export default connect(null, mapDispatchToProps)(CardSala);