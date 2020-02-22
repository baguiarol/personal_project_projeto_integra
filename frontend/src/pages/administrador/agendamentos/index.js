import React from 'react';
import AdministradorTopbar from "../../../assets/component/adm_topbar/adm_topbar";
import CalendarAgendamentos from "../../../assets/component/calendar_agendamentos/CalendarAgendamentos";
import './agendamentos.sass';
import ModalTypes from "../../../assets/modal_types";
import Actions from "../../../redux/actions/actions";
import {connect} from "react-redux";
import ModalAgendamentoAdm
    from "../../../assets/component/modals/administrativo/modal_new_agendamento_adm/modal_new_agendamento_adm";

const AgendamentosAdministrador = props => {
    return (
        <div>
            <AdministradorTopbar pageSelected={'agendamento_adm'} />
            <div className={'container_salas'}>
                <ModalAgendamentoAdm
                    close={() => props.closeModal()}
                    show={props.showModal &&
                    props.modalType === ModalTypes.adicionarAgendamentoAdm}
                />
                <CalendarAgendamentos/>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    showModal: state.general.showModal,
    modalType: state.general.modalType,
});

const mapDispatchToProps = dispatch => ({
    openModal: open => dispatch({type: Actions.showModal, payload: open}),
    closeModal: () => dispatch({type: Actions.closeModal}),
});

export default connect(mapStateToProps, mapDispatchToProps)(AgendamentosAdministrador);