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

    const watcher = async () => {
        const stream = await props.database.collection('reservas').watch()

        stream.onNext((change) => {
            reservaDAO.findAll(props.client).then(res => {
                props.setAgendamentos(res);
            });
        });
    }

    React.useEffect(() => {
        if (props.database) {
            watcher().then(() => console.log('connection established'))
        }
    }, [props.database])

    React.useEffect(() => {
        if (clienteDAO.db) {
            if ('ocupacao' in props.userLogged) {
                hist.push('/');
            }
            clienteDAO.findAll().then(res => {
                props.setProfissionais(res);
            });

            sala_bloqueioDAO.findAll().then(res => {
                props.setBloqueiosSalas(res)
            });

            salaDAO.findAll().then(res => {
                let array = res.sort((a,b) => {
                    let [first, second] = [ a.nome.split(' '), b.nome.split(' ') ]
                    if (+first[1] > +second[1]) { return 1 }
                    if (+first[1] < +second[1]) { return -1 }
                    else return 0
                })
                props.setSalas(array);
            });
            reservaDAO.findAll(props.client).then(res => {
                props.setAgendamentos(res);
            });
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
    setSalas: salas => dispatch({type: Actions.setSalas, payload: salas}),
    selectDate: date => dispatch({type: Actions.selectDate, payload: date}),
    setAgendamentos: agendamentos => dispatch({type: Actions.setAgendamentos, payload: agendamentos}),
    setLogs: logs => dispatch({type: Actions.setLogs, payload: logs}),
    setBloqueiosSalas: bloqueios => dispatch({type: Actions.setBloqueiosSalas, payload: bloqueios})
});

export default connect(mapStateToProps, mapDispatchToProps)(AgendamentosAdministrador);
