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
import {useHistory} from "react-router";

const SalasPage = props => {

    const hist = useHistory();

    if ('ocupacao' in props.userLogged) {
        hist.push('/');
    }

    React.useEffect(() => {
        if (salaDAO.db) {
            salaDAO.findAll().then(res => {
                props.setSalas(res);
            })
        }
    });


    return (
        <div>
            <AdministradorTopbar pageSelected={'salas'}/>
            <ModalNewSalas
                close={() => props.closeModal()}
                show={props.showModal &&
                props.modalType === ModalTypes.adicionarSalas}
            />
            <div className={'salas_container'}>
                <div className={'header_salas'}>
                    <div>
                        <h1>Salas Cadastradas</h1>
                        <h3>Abaixo seguem as salas possuídas pela Integra</h3>
                    </div>
                    <div>
                        <Button width={'50%'} text={'Nova Sala'}/>
                    </div>
                </div>
                <div className={'salas'}>
                    {
                        props.salas.map((sala, index) => (
                            <CardSala sala={sala} key={index}/>
                        ))
                    }
                </div>
            </div>
            <Fab onClick={() => props.openModal(ModalTypes.adicionarSalas)}/>
        </div>
    )
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