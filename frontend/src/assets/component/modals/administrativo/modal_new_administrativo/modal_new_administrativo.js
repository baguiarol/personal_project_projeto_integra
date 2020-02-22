import React from 'react';
import ModalParent from "../../modal_parent/modal";
import InputText from "../../../inputText/input";
import Button from "../../../button/button";
import "./modal_new_administrativo.sass";
import FileInput from "../../../file_input/FileInput";
import Actions from "../../../../../redux/actions/actions";
import {connect} from "react-redux";
import {post} from 'axios';
import {checkIfURLIsImage} from "../../../../AuxFunctions";
import clienteDAO from "../../../../../DAO/clienteDAO";

const ModalNewAdministrativo = ({show, close, mongoClient}) => {

    const [loading, setLoading] = React.useState(false);
    const [file, setFile] = React.useState(null);
    const [fileURL, setFileURL] = React.useState('');

    const fileUpload = async (file) => {
        const url = 'https://teste.integracps.com.br/imageUpload.php';
        const formData = new FormData();
        formData.append('userfile', file);
        const config = {headers: {'content-type': 'multipart/form-data'}};
        return post(url, formData, config);
    }

    const onSubmit = async e => {
        const form = e.target;
        e.preventDefault();
        setLoading(true);
        if (checkIfURLIsImage(fileURL)) {
            try {
                await fileUpload(file);
                await clienteDAO.addUser(mongoClient, form.email.value, form.senha.value, {
                    nome: form.nome.value,
                    foto_url: fileURL,
                    email: form.email.value,
                });
                checkIfURLIsImage(fileURL);
                alert('Profissional Adicionado com Sucesso!')
            } catch (err) {
                alert(err);
            }
            setLoading(false);
        }
    }

    return (
        <ModalParent
            onSubmit={onSubmit}
            show={show}
            header={<header>
                <div>
                    <h1>Adicionar Administrativo</h1>
                </div>
                <div className={'close_container'} onClick={close}>
                    <i className={'fa fa-times'}/>
                </div>
            </header>}
            body={<div>
                <FileInput
                    onChangeFile={(file, url) => {
                        setFile(file);
                        setFileURL(url);
                    }}
                    urlName={'foto_url'}
                    fileName={'userfile'}/>
                <InputText label={'Nome'} name={'nome'}/>
                <InputText label={'Login'} name={'email'}/>
                <div className={'flex'}>
                    <InputText label={'Senha'} name={'senha'}/>
                    <InputText label={'Confirmar Senha'}/>
                </div>
            </div>}
            footer={
                <div className={'footer'}>
                    <Button loading={loading} type={'submit'} text={'Confirmar'}/>
                </div>}/>
    )
};

const mapStateToProps = state => ({
    mongoClient: state.general.mongoClient
});

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch({type: Actions.closeModal})
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalNewAdministrativo)