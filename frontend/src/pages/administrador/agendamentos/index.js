import React from 'react';
import AdministradorTopbar from "../../../assets/component/adm_topbar/adm_topbar";
import CalendarAgendamentos from "../../../assets/component/calendar_agendamentos/CalendarAgendamentos";
import './agendamentos.sass';
import ModalTypes from "../../../assets/modal_types";
import Actions from "../../../redux/actions/actions";
import {connect} from "react-redux";
import ModalAgendamentoAdm
    from "../../../assets/component/modals/administrativo/modal_new_agendamento_adm/modal_new_agendamento_adm.jsx";
import clienteDAO from "../../../DAO/clienteDAO";
import salaDAO from "../../../DAO/salaDAO";
import reservaDAO from "../../../DAO/reservaDAO";
import logDAO from "../../../DAO/logDAO";
import {useHistory} from "react-router";
import ModalEditAgendamento from "../../../assets/component/modals/administrativo/modal_edit_agendamento/EditAgendamento";

const AgendamentosAdministrador = props => {

    const hist = useHistory();

    React.useEffect(() => {
        if (clienteDAO.db) {
            if ('ocupacao' in props.userLogged) {
                hist.push('/');
            }
            clienteDAO.findAll().then(res => {
                props.setProfissionais(res);
            });
            salaDAO.findAll().then(res => {
                props.setSalas(res);
            });
            reservaDAO.findAll(props.client).then(res => {
                props.setAgendamentos(res);
            });
            logDAO.findAll().then(res => {
                props.setLogs(res);
            })
        }
    });

    return (
        <div>
            <AdministradorTopbar pageSelected={'agendamento_adm'} />
            <div className={'container_salas'}>
                <ModalAgendamentoAdm
                    close={() => props.closeModal()}
                    show={props.showModal &&
                    props.modalType === ModalTypes.adicionarAgendamentoAdm}
                />
                <ModalEditAgendamento
                    close={() => props.closeModal()}
                    show={props.showModal &&
                    props.modalType === ModalTypes.editarAgendamento}
                />
                <CalendarAgendamentos/>
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    showModal: state.general.showModal,
    modalType: state.general.modalType,
    userLogged: state.general.userLogged,
    client: state.general.mongoClient,
});

const mapDispatchToProps = dispatch => ({
    openModal: open => dispatch({type: Actions.showModal, payload: open}),
    closeModal: () => dispatch({type: Actions.closeModal}),
    setProfissionais: prof => dispatch({type: Actions.setProfissionais, payload: prof}),
    setSalas: salas => dispatch({type: Actions.setSalas, payload: salas}),
    setAgendamentos: agendamentos => dispatch({type: Actions.setAgendamentos, payload: agendamentos}),
    setLogs: logs => dispatch({type: Actions.setLogs, payload: logs}),
});

export default connect(mapStateToProps, mapDispatchToProps)(AgendamentosAdministrador);