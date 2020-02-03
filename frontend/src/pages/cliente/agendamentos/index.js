import React from 'react';
import {connect} from "react-redux";
import ClienteTopbar from "../../../assets/component/cliente_topbar/topbar";
import Sala from "../../../assets/component/sala/sala";
import "./styles.sass";
import ModalAgendamento from "../../../assets/component/modal_agendamento/modalAgendamento";
import Actions from "../../../redux/actions/actions";

const ClienteAgendamentos = props => {
    return (
        <div>
            <ModalAgendamento
                close={() => props.openModal(false)}
                show={props.showModal}/>
            <ClienteTopbar />
            <div className={'container_salas'}>
                <Sala addReservaListener={() => props.openModal(true)}/>
                <Sala />
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    showModal: state.general.showModal,
})

const mapDispatchToProps = dispatch => ({
    openModal: open => dispatch({type: Actions.showModal, payload: open}),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClienteAgendamentos)