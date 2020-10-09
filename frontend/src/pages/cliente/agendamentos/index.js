import React from 'react';
import {connect, useDispatch} from "react-redux";
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
import sala_bloqueioDAO from "../../../DAO/sala_bloqueioDAO";

const ClienteAgendamentos = props => {

    const [selectedTab, selectTab] = React.useState(0);

    const story = useHistory();
    const d = useDispatch();

    React.useEffect(() => {
        if (!('nome' in props.userLogged))
            story.push('/');
    })

    const sortSalas = (a,b) => {
        let [first, second] = [ a.nome.split(' '), b.nome.split(' ') ]
        if (+first[1] > +second[1]) { return 1 }
        if (+first[1] < +second[1]) { return -1 }
        else return 0
    }

    const watcher = async () => {
        const stream = await props.database.collection('reservas').watch()

        stream.onNext(() => {
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
        if (clienteDAO.db && 'nome' in props.userLogged) {
            salaDAO.findAll().then(res => {
                if (props.userLogged.sala_fixa) {
                    res.sort(sortSalas);
                    // coloca no topo. Função Swap
                    for (let i = 0; i < res.length; i++) {
                        if (props.userLogged.sala_fixa.toString() === res[i]._id.toString()) {
                            let aux = res[0]
                            res[0] = res[i]
                            res[i] = aux
                        }
                    }
                } else {
                    res.sort(sortSalas)
                }
                console.log(res)
                props.setSalas(res);
            });
            sala_bloqueioDAO.findAll().then(res => {
                props.setBloqueiosSalas(res)
            })
            console.log("fetching reservas");
            reservaDAO.findThisMonth(props.client).then(res => {
                d({type: Actions.setFetchedAgendamentos, payload: true});
                console.log("Fetched")
                props.setAgendamentos(res);
                props.setProfissionalReservas(reservaDAO.findReservaDeCliente(props.userLogged._id, res));
            });
        }
    }, [props.userLogged]);

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
    database: state.general.database,
    client: state.general.mongoClient,
    userLogged: state.general.userLogged,
    agendamentos: state.agendamentos.agendamentos,
    salaBloqueios: state.salas.salaBloqueios,
});

const mapDispatchToProps = dispatch => ({
    openModal: open => dispatch({type: Actions.showModal, payload: open}),
    closeModal: () => dispatch({type: Actions.closeModal}),
    setSalas: salas => dispatch({type: Actions.setSalas, payload: salas}),
    selectDate: date => dispatch({type: Actions.selectDate, payload: date}),
    setBloqueiosSalas: bloqueios => dispatch({type: Actions.setBloqueiosSalas, payload: bloqueios}),
    selectSala: sala => dispatch({type: Actions.selectSala, payload: sala}),
    setAgendamentos: agendamentos => dispatch({type: Actions.setAgendamentos, payload: agendamentos}),
    setProfissionalReservas: reservas => dispatch({type: Actions.setProfissionalReservas, payload: reservas}),
});

export default connect(mapStateToProps, mapDispatchToProps)(ClienteAgendamentos)
