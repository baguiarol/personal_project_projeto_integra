import React from 'react';
import './styles.sass';
import PropTypes from 'prop-types';
import Button from "../button/button";
import Actions from "../../../redux/actions/actions";
import {connect} from "react-redux";
import ModalTypes from "../../modal_types";

const CardProfissional = props => {
    return (
        <div className={'card_profissional'}>
            <img
                alt={'profissional_pic'}
                src={props.profissional.foto_url}/>
            <h2>{props.profissional.nome}</h2>
            <h3>{props.profissional.ocupacao}</h3>
            <Button text={'Informações'} onClick={ () => {
                props.selectProfissional(props.profissional);
                props.openModal(ModalTypes.adicionarProfissional);
            }}/>
        </div>
    )
}

CardProfissional.propTypes = {
    profissional: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
    openModal: type => dispatch({type: Actions.showModal, payload: type}),
    selectProfissional: prof => dispatch({type: Actions.selectProfissional, payload: prof}),
});

export default connect(null, mapDispatchToProps)(CardProfissional);