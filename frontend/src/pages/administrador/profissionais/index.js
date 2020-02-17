import React from 'react';
import AdministradorTopbar from "../../../assets/component/adm_topbar/adm_topbar";
import CardProfissional from "../../../assets/component/card_profissional/cardProfissional";
import "./profissionais.sass";
import Fab from "../../../assets/component/Fab/Fab";
import Actions from "../../../redux/actions/actions";
import {connect} from "react-redux";
import ModalNewProfissional
    from "../../../assets/component/modals/administrativo/modal_new_profissional/modal_new_profissional";
import ModalTypes from "../../../assets/modal_types";

const ProfissionaisPage = props => {
    return (
        <div>
            <ModalNewProfissional
                close={() => props.closeModal()}
                show={props.showModal &&
                props.modalType === ModalTypes.adicionarProfissional}/>
            <AdministradorTopbar pageSelected={'profissionais'}/>
            <div className={'profissionais_container'}>
                <CardProfissional />
                <CardProfissional />
                <CardProfissional />
                <CardProfissional />
                <CardProfissional />
                <CardProfissional />
            </div>
            <Fab onClick={() => { props.openModal(ModalTypes.adicionarProfissional)}} />
        </div>
    )
}

const mapStateToProps = state => ({
    showModal: state.general.showModal,
    modalType: state.general.modalType,
})

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch({type: Actions.closeModal}),
    openModal: open => dispatch({type: Actions.showModal, payload: open}),
})
export default connect(mapStateToProps, mapDispatchToProps)(ProfissionaisPage);