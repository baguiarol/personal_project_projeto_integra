import React from 'react';
import PropTypes from 'prop-types';
import ModalTypes from "../../../modal_types";
import {connect} from "react-redux";
import Actions from "../../../../redux/actions/actions";


const NovoAgendamento = props => {
    return (
        <td className={'free'} onClick={() => {
            props.openModal(ModalTypes.adicionarAgendamentoAdm);
            props.selectSala(props.sala);
        }}>
            <i className={'fa fa-plus'}/>
        </td>
    )
}

NovoAgendamento.propTypes = {
    sala: PropTypes.object.isRequired,
}

const mapStateToProps = state => {

}

const mapDispatchToProps = dispatch => ({
    selectSala: sala => dispatch({type: Actions.selectSala, payload: sala}),
    openModal: open => dispatch({type: Actions.showModal, payload: open}),
})

export default connect(mapStateToProps, mapDispatchToProps)(NovoAgendamento);