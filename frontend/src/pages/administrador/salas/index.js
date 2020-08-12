import React from 'react';
import "./salas.sass";
import AdministradorTopbar from "../../../assets/component/adm_topbar/adm_topbar";
import Button from "../../../assets/component/button/button";
import CardSala from "../../../assets/component/card_sala/cardSala";
import Fab from "../../../assets/component/Fab/Fab";
import ModalNewSalas from "../../../assets/component/modals/administrativo/modal_new_salas/modal_new_salas";
import ModalTypes from "../../../assets/modal_types";
import Actions from "../../../redux/actions/actions";
import {connect} from "react-redux";
import salaDAO from "../../../DAO/salaDAO";
import {Redirect} from 'react-router-dom';
import {useHistory} from "react-router";
import ModalBloquearSala from "../../../assets/component/modals/administrativo/modal_bloquear_sala/ModalBloquearSala";
import sala_bloqueioDAO from "../../../DAO/sala_bloqueioDAO";

const SalasPage = props => {

    const hist = useHistory();

    const [loading, setLoading] = React.useState(false)
    const [wholeDay, setWholeDay] = React.useState(false)

    if ('ocupacao' in props.userLogged) {
        hist.push('/');
    }

    React.useEffect(() => {
        if (salaDAO.db) {
            salaDAO.findAll().then(res => {
                props.setSalas(res);
            })
        }
    }, []);

    const sortSalas = (a, b) => {
        let [first, second] = [a.nome.split(' '), b.nome.split(' ')]
        if (+first[1] > +second[1]) return 1
        if (+first[1] < +second[1]) return -1
        else return 0
    }

    return ('nome' in props.userLogged) ? (
        <div>
            <AdministradorTopbar pageSelected={'salas'}/>
            <ModalBloquearSala
                setWholeDay={setWholeDay}
                loading={loading}
                onSubmit={async e => {
                    e.preventDefault()
                    setLoading(true)
                    const form = e.target;
                    let data = {
                        sala: {$oid: form.select_salas.value},
                        dia: new Date(form.date.value),
                    }
                    if (!wholeDay)
                        data = {...data, horaInicio: form.hora_inicio.value, horaFim: form.hora_fim.value}
                    else
                        data = {...data, wholeDay: wholeDay}
                    try {
                        await sala_bloqueioDAO.create(data)
                        props.closeModal()
                    } catch(e) {
                        alert('Erro: '+e)
                    }
                    setLoading(false)
                }}
                close={() => props.closeModal()}
                show={
                    props.showModal &&
                    props.modalType === ModalTypes.bloquearSalas
                }/>
            <ModalNewSalas
                close={() => props.closeModal()}
                show={props.showModal &&
                props.modalType === ModalTypes.adicionarSalas}
            />
            <div className={'salas_container'}>
                <div className={'header_salas'}>
                    <div style={{flexGrow: 1}}>
                        <h1>Salas Cadastradas</h1>
                        <h3>Abaixo seguem as salas possuídas pela Integra</h3>
                    </div>
                    <div style={{width: 'auto'}}>
                        <Button
                            width={'250px'}
                            text={'Bloquear Salas'}
                            onClick={() => props.openModal(ModalTypes.bloquearSalas)}/>
                    </div>
                </div>
                <div className={'salas'}>
                    {
                        props.salas.sort(sortSalas).map((sala, index) => (
                            <CardSala sala={sala} key={index}/>
                        ))
                    }
                </div>
            </div>
            <Fab onClick={() => props.openModal(ModalTypes.adicionarSalas)}/>
        </div>
    ) : (<Redirect to={'/'}/>)
}

const mapStateToProps = state => ({
    showModal: state.general.showModal,
    modalType: state.general.modalType,
    salas: state.salas.salas,
    userLogged: state.general.userLogged,
});

const mapDispatchToProps = dispatch => ({
    openModal: open => dispatch({type: Actions.showModal, payload: open}),
    closeModal: () => dispatch({type: Actions.closeModal}),
    setSalas: salas => dispatch({type: Actions.setSalas, payload: salas})
});

export default connect(mapStateToProps, mapDispatchToProps)(SalasPage);
