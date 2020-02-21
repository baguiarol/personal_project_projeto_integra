import React from 'react';
import './admin.sass';
import AdministradorTopbar from "../../../assets/component/adm_topbar/adm_topbar";
import CardAdministrativo from "../../../assets/component/card_administrativo/cardAdministrativo";
import Fab from "../../../assets/component/Fab/Fab";
import Actions from "../../../redux/actions/actions";
import ModalTypes from "../../../assets/modal_types";
import ModalNewAdministrativo
    from "../../../assets/component/modals/administrativo/modal_new_administrativo/modal_new_administrativo";
import {connect} from "react-redux";

const AdministrativoPage = props => {
    return (
        <div>
            <ModalNewAdministrativo
                close={() => props.closeModal()}
                show={props.showModal &&
                props.modalType === ModalTypes.adicionarAdministrador}
            />
            <AdministradorTopbar pageSelected={'administrativo'}/>
            <div className={'container_adms'}>
                <CardAdministrativo/>
                <CardAdministrativo/>
                <CardAdministrativo/>
                <CardAdministrativo/>
            </div>
            <Fab onClick={() => {
                props.openModal(ModalTypes.adicionarAdministrador);
            }} />
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

export default connect(mapStateToProps, mapDispatchToProps)(AdministrativoPage);