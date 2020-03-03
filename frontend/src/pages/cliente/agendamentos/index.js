import React from 'react';
import {connect} from "react-redux";
import ClienteTopbar from "../../../assets/component/cliente_topbar/topbar";
import Sala from "../../../assets/component/sala/sala";
import "./agenda.sass";
import ModalAgendamento from "../../../assets/component/modals/cliente/modal_agendamento/modalAgendamento";
import Actions from "../../../redux/actions/actions";
import ModalTypes from "../../../assets/modal_types";
import ModalDetalhesSala from "../../../assets/component/modals/cliente/modal_detalhes_sala/detalhesSala";
import AlternatingTab from "../../../assets/component/alternating_tab/alt_tab";
import Snack from "../../../assets/component/Snack/snack";
import ModoPaisagem from "../../../assets/component/modoPaisagem/modoPaisagem";
import clienteDAO from "../../../DAO/clienteDAO";
import salaDAO from "../../../DAO/salaDAO";
import reservaDAO from "../../../DAO/reservaDAO";
import logDAO from "../../../DAO/logDAO";

const ClienteAgendamentos = props => {

    const [selectedTab, selectTab] = React.useState(0);

    React.useEffect(() => {
        if (clienteDAO.db) {
            salaDAO.findAll().then(res => {
                props.setSalas(res);
            });
            reservaDAO.findAll(props.client).then(res => {
                props.setAgendamentos(res);
            });
        }
    }, [props.client]);

    return (
        <div>
            <ModoPaisagem/>
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
                {
                    props.salas.map((sala, index) => (
                        <Sala
                            sala={sala}
                            key={index}
                            onClickDetalhesListener={() => {
                                props.openModal(ModalTypes.detalhesSala);
                            }}
                            addReservaListener={date => {
                                props.selectDate(date.toDate());
                                console.log(date.toDate());
                                props.selectSala(sala);
                                props.openModal(ModalTypes.reservaCliente)
                            }}/>
                    ))
                }
            </div>
        </div>
    )
};

const mapStateToProps = state => ({
    showModal: state.general.showModal,
    modalType: state.general.modalType,
    salas: state.salas.salas,
    client: state.general.mongoClient,
});

const mapDispatchToProps = dispatch => ({
    openModal: open => dispatch({type: Actions.showModal, payload: open}),
    closeModal: () => dispatch({type: Actions.closeModal}),
    setSalas: salas => dispatch({type: Actions.setSalas, payload: salas}),
    selectDate: date => dispatch({type: Actions.selectDate, payload: date}),
    selectSala: sala => dispatch({type: Actions.selectSala, payload: sala}),
    setAgendamentos: agendamentos => dispatch({type: Actions.setAgendamentos, payload: agendamentos}),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClienteAgendamentos)