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
import clienteDAO from "../../../DAO/clienteDAO";
import {useHistory} from "react-router";

const ProfissionaisPage = props => {

    const hist = useHistory();

    React.useEffect(() => {

        if ('ocupacao' in props.userLogged) {
            hist.push('/');
        }

        if (clienteDAO.db) {
            clienteDAO.findAll().then(res => {
                props.setProfissionais(res);
            })
        }
    }, [props.client]);
    
    return (
        <div>
            <ModalNewProfissional
                close={() => props.closeModal()}
                show={props.showModal &&
                props.modalType === ModalTypes.adicionarProfissional}/>
            <AdministradorTopbar pageSelected={'profissionais'}/>
            <div className={'profissionais_container'}>
                {
                    props.profissionais.map(profissional => (
                        <CardProfissional profissional={profissional}/>
                    ))
                }
            </div>
            <Fab onClick={() => { props.openModal(ModalTypes.adicionarProfissional)}} />
        </div>
    )
}

const mapStateToProps = state => ({
    showModal: state.general.showModal,
    modalType: state.general.modalType,
    client: state.general.mongoClient,
    userLogged: state.general.userLogged,
    profissionais: state.profissionais.profissionais,
})

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch({type: Actions.closeModal}),
    openModal: open => dispatch({type: Actions.showModal, payload: open}),
    setProfissionais: profs => dispatch({type: Actions.setProfissionais, payload: profs}),
})
export default connect(mapStateToProps, mapDispatchToProps)(ProfissionaisPage);