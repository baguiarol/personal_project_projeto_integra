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
import {Redirect, useHistory} from "react-router";
import ModalEditAgendamento from "../../../assets/component/modals/administrativo/modal_edit_agendamento/EditAgendamento";
import sala_bloqueioDAO from "../../../DAO/sala_bloqueioDAO";
import ModalSelectDay from "../../../assets/component/modals/administrativo/modal_select_day/ModalSelectDay";

const AgendamentosAdministrador = props => {

    const hist = useHistory();

    const watchItems = () => {
        const streamPromise = props.database.collection('reservas').watch()
        const getStream = () => streamPromise;
        const closeStream = () =>  streamPromise.then(stream => stream.close);
        return [getStream, closeStream];
    }

    React.useEffect(() => {
        if (props.database) {
            const [getStream, closeStream] = watchItems();
            getStream().then(stream => {
                stream.onNext(() => {
                    reservaDAO.findAll(props.client).then(res => {
                        props.setAgendamentos(res);
                    });
                })
            })
            return closeStream;
        }
    }, [props.database]);

    React.useEffect(() => {
        if (clienteDAO.db) {
            if ('ocupacao' in props.userLogged) {
                hist.push('/');
            }

            sala_bloqueioDAO.findAll().then(res => {
                props.setBloqueiosSalas(res)
            });
            console.time("Time find All in client")
           reservaDAO.findAllInClient(props).then(res => {
               // return [salas, clientsArr, reservasArr];
               props.setSalas(res[0]);
               props.setProfissionais(res[1]);
               props.setAgendamentos(res[2]);
               console.timeEnd("Time find All in client")
           });

            // console.time("Time Find All");
            // reservaDAO.findAll(props.client).then(res => {
            //     props.setAgendamentos(res);
            //     console.timeEnd("Time Find All");
            // });
            logDAO.findAll().then(res => {
                props.setLogs(res);
            })
        }
    }, []);

    return ('nome' in props.userLogged) ?
        <div>
            <AdministradorTopbar pageSelected={'agendamento_adm'} />
            <div className={'container_salas'}>
                <ModalSelectDay
                    show={props.showModal && props.modalType === ModalTypes.selectDay}
                    close={() => props.closeModal()}
                    onChangeDay={(day) =>  {
                    if (day)
                        props.selectDate(day)
                }} />
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
                <CalendarAgendamentos />
            </div>
        </div> : <Redirect to={'/'} />

}

const mapStateToProps = state => ({
    showModal: state.general.showModal,
    modalType: state.general.modalType,
    database: state.general.database,
    userLogged: state.general.userLogged,
    client: state.general.mongoClient,
});

const mapDispatchToProps = dispatch => ({
    openModal: open => dispatch({type: Actions.showModal, payload: open}),
    closeModal: () => dispatch({type: Actions.closeModal}),
    setProfissionais: prof => dispatch({type: Actions.setProfissionais, payload: prof}),
    setProfissionaisHash: hash => dispatch({type: Actions.setProfissionaisHash, payload: hash}),
    setSalas: salas => dispatch({type: Actions.setSalas, payload: salas}),
    selectDate: date => dispatch({type: Actions.selectDate, payload: date}),
    setAgendamentos: agendamentos => dispatch({type: Actions.setAgendamentos, payload: agendamentos}),
    setLogs: logs => dispatch({type: Actions.setLogs, payload: logs}),
    setBloqueiosSalas: bloqueios => dispatch({type: Actions.setBloqueiosSalas, payload: bloqueios})
});

export default connect(mapStateToProps, mapDispatchToProps)(AgendamentosAdministrador);
