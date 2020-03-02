import React from 'react';
import Button from "../button/button";
import "./styles.sass";
import PropTypes from 'prop-types';
import Actions from "../../../redux/actions/actions";
import {connect} from "react-redux";
import ModalTypes from "../../modal_types";

const CardAdministrativo = props => {
    return (
        <div className={'card_administrativo'}>
            <img
                alt={'administrativo_pic'}
                src={props.administrador.foto_url}/>
            <h2>{props.administrador.nome}</h2>
            <Button text={'Informações'} onClick={() => {
                props.selectAdministrador(props.administrador);
                props.openModal(ModalTypes.adicionarAdministrador);
            }}/>
        </div>
    )
}

CardAdministrativo.propTypes = {
    administrador: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
    openModal: type => dispatch({type: Actions.showModal, payload: type}),
    selectAdministrador: adm => dispatch({type: Actions.selectAdministrador, payload: adm}),
});

export default connect(null, mapDispatchToProps)(CardAdministrativo);