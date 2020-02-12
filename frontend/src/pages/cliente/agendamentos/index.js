import React from 'react';
import {connect} from "react-redux";
import ClienteTopbar from "../../../assets/component/cliente_topbar/topbar";
import Sala from "../../../assets/component/sala/sala";
import "./agenda.sass";
import ModalAgendamento from "../../../assets/component/modal_agendamento/modalAgendamento";
import Actions from "../../../redux/actions/actions";
import ModalTypes from "../../../assets/modal_types";
import ModalDetalhesSala from "../../../assets/component/modal_detalhes_sala/detalhesSala";
import AlternatingTab from "../../../assets/component/alternating_tab/alt_tab";
import Snack from "../../../assets/component/Snack/snack";
import Redirect from 'react-router-dom/Redirect';

const ClienteAgendamentos = props => {

    const [selectedTab, selectTab] = React.useState(0);


    return (
        <div>
            <ModalAgendamento
                close={() => props.closeModal()}
                show={props.showModal &&
                props.modalType === ModalTypes.reservaCliente}
            />
            <ModalDetalhesSala
                close={() => props.closeModal()}
                show={props.showModal && props.modalType === ModalTypes.detalhesSala}
            />
            <ClienteTopbar />
            <div className={'info_container'}>
                <AlternatingTab selectedIndex={selectedTab} elements={[{
                    name: 'Salas para Reservar',
                    onClick: () => selectTab(0),
                }, {
                    name: 'Minhas Reservas',
                    onClick: () => { selectTab(1) },
                }]}/>
                <Snack/>
            </div>
            <div className={'container_salas'}>
                <Sala
                    onClickDetalhesListener={() => {
                        props.openModal(ModalTypes.detalhesSala);
                    }}
                    addReservaListener={() =>
                        props.openModal(ModalTypes.reservaCliente)}/>
                <Sala />
            </div>
        </div>
    )
};

const mapStateToProps = state => ({
    showModal: state.general.showModal,
    modalType: state.general.modalType,
});

const mapDispatchToProps = dispatch => ({
    openModal: open => dispatch({type: Actions.showModal, payload: open}),
    closeModal: () => dispatch({type: Actions.closeModal}),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClienteAgendamentos)