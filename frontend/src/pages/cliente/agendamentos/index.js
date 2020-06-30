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
import {useHistory} from "react-router";

const ClienteAgendamentos = props => {

    const [selectedTab, selectTab] = React.useState(0);

    const story = useHistory();

    React.useEffect(() => {
        if (!('nome' in props.userLogged))
            story.push('/');
    })

    React.useEffect(() => {
        if (clienteDAO.db && 'nome' in props.userLogged) {
            salaDAO.findAll().then(res => {
                if ('sala_fixa' in props.userLogged) {
                    let salaFixa = props.userLogged.sala_fixa.toString();
                    res.sort(function(x,y){ return x._id.toString() == salaFixa ? -1 : y._id.toString() == salaFixa ? 1 : 0; });
                }
                props.setSalas(res);
            });
            reservaDAO.findAll(props.client).then(res => {
                props.setAgendamentos(res);
                props.setProfissionalReservas(reservaDAO.findReservaDeCliente(props.userLogged._id, res));
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
            <ClienteTopbar/>
            <div className={'info_container'}>
                <AlternatingTab selectedIndex={selectedTab} elements={[{
                    name: 'Salas para Reservar',
                    onClick: () => selectTab(0),
                }, {
                    name: 'Minhas Reservas',
                    onClick: () => {
                        selectTab(1)
                    },
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
                                props.selectSala(sala)
                                props.openModal(ModalTypes.detalhesSala);
                            }}
                            addReservaListener={date => {
                                props.selectDate(date.toDate());
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
    userLogged: state.general.userLogged,
    agendamentos: state.agendamentos.agendamentos,
});

const mapDispatchToProps = dispatch => ({
    openModal: open => dispatch({type: Actions.showModal, payload: open}),
    closeModal: () => dispatch({type: Actions.closeModal}),
    setSalas: salas => dispatch({type: Actions.setSalas, payload: salas}),
    selectDate: date => dispatch({type: Actions.selectDate, payload: date}),
    selectSala: sala => dispatch({type: Actions.selectSala, payload: sala}),
    setAgendamentos: agendamentos => dispatch({type: Actions.setAgendamentos, payload: agendamentos}),
    setProfissionalReservas: reservas => dispatch({type: Actions.setProfissionalReservas, payload: reservas}),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClienteAgendamentos)
