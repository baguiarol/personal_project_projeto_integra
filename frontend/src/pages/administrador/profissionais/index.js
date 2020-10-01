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
import CsvDownload from 'react-json-to-csv';

const ProfissionaisPage = props => {

    const hist = useHistory();
    const [profExport, setProfExport] = React.useState([]);

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

    React.useEffect(() => {
        let array = []
        props.profissionais.forEach((prof) => {
            array.push({nome: prof.nome, email: prof.email});
        })
        setProfExport(array);
    }, [props.profissionais])
    
    return (
        <div>
            <ModalNewProfissional
                close={() => props.closeModal()}
                show={props.showModal &&
                props.modalType === ModalTypes.adicionarProfissional}/>
            <AdministradorTopbar pageSelected={'profissionais'}/>
            <CsvDownload style={{width: 220, marginTop: 20, marginLeft: 20}} className={'button'} data={profExport} filename={'profissionais.csv'}>
                Exportar Dados
            </CsvDownload>
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