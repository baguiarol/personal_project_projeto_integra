import React from 'react';
import ModalParent from "../../modal_parent/modal";
import FileInput from "../../../file_input/FileInput";
import InputText from "../../../inputText/input";
import Button from "../../../button/button";
import Actions from "../../../../../redux/actions/actions";
import {connect} from "react-redux";
import salaDAO from "../../../../../DAO/salaDAO";

const ModalNewSalas = ({show, closeModal, mongoClient, close}) => {

    const [loading, setLoading] = React.useState(false);
    const [file, setFile] = React.useState(null);
    const [fileURL, setFileURL] = React.useState('');

    const onSubmit = async e => {
        e.preventDefault();
        const form = e.target;
        setLoading(true);
        await salaDAO.create({
            nome: form.nome.value,
            descricao: form.descricao.value,
            valor_hora: form.valor_hora.value,
        });
        alert('Sala Adicionada com Sucesso!');
        setLoading(false);
        closeModal();
    };

    return (
        <ModalParent show={show}
                     onSubmit={onSubmit}
                     header={<header>
                         <div>
                             <h1>Adicionar Sala</h1>
                         </div>
                         <div className={'close_container'} onClick={close}>
                             <i className={'fa fa-times'}/>
                         </div>
                     </header>}
                     body={<div>
                         <InputText label={"Nome"} name={'nome'} required/>
                         <InputText label={"Descrição"} name={'descricao'} required />
                         <InputText label={'Valor da Hora'} name={'valor_hora'} type={'number'} required />
                     </div>}
                     footer={
                         <div className={'footer'}>
                             <Button loading={loading} type={'submit'} text={'Confirmar'}/>
                         </div>}/>
    )
};

const mapStateToProps = state => ({
    mongoClient: state.general.mongoClient,
});

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch({type: Actions.closeModal})
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalNewSalas)