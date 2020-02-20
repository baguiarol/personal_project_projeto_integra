import React from 'react';
import ModalParent from "../../modal_parent/modal";
import InputText from "../../../inputText/input";
import Button from "../../../button/button";
import "./modal_new_profissional.sass";
import clienteDAO from "../../../../../DAO/clienteDAO";
import {connect} from "react-redux";
import Actions from "../../../../../redux/actions/actions";
import FileInput from "../../../file_input/FileInput";
import {post} from 'axios';

const ModalNewProfissional = ({show, close, mongoClient, closeModal}) => {

    const [loading, setLoading] = React.useState(false);
    const [file, setFile] = React.useState()

    const fileUpload = async (file) => {
        const url = 'https://teste.integracps.com.br/imageUpload.php';
        const formData = new FormData();
        formData.append('file', file);
        const config = { headers: {'Content-Type': 'multipart/form-data'}};
        return post(url, formData, config);
    }

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        const form = e.target;
        try {
            alert(JSON.stringify(await fileUpload(form.fileToUpload.files[0])));
            // await clienteDAO.addUser(mongoClient, form.email.value, form.senha.value, {
            //     nome: form.nome.value,
            //     telefone: form.telefone.value,
            //     ocupacao: form.ocupacao.value,
            //     descricao: form.descricao.value,
            //     foto_url: form.foto_url.value,
            //     email: form.email.value,
            // });
            alert('Profissional Adicionado com Sucesso!')
        } catch(err) {
            alert(err);
        }
        setLoading(false);
        closeModal();
    }

    return (
        <ModalParent show={show}
                     onSubmit={onSubmit}
                     header={<header>
                         <div>
                             <h1>Adicionar Profissional</h1>
                         </div>
                         <div className={'close_container'} onClick={close}>
                             <i className={'fa fa-times'}/>
                         </div>
                     </header>}
                     body={<div>
                         <FileInput
                            urlName={'foto_url'}
                            fileName={'fileToUpload'} />
                         <InputText name={'nome'} label={'Nome'}/>
                         <div className={'flex'}>
                             <InputText name={'telefone'} label={'Telefone'}/>
                             <InputText name={'ocupacao'} label={'Ocupação'}/>
                         </div>
                         <InputText name={'descricao'} label={'Descrição'}/>
                         <InputText name={'email'} label={'Email'} placeholder={'E-mail utilizado para Login'}/>
                         <div className={'flex'}>
                             <InputText name={'senha'} label={'Senha'}/>
                             <InputText name={'confirmar_senha'} label={'Confirmar Senha'}/>
                         </div>
                     </div>}
                     footer={
                         <div className={'footer'}>
                             <Button loading={loading} type={'submit'} text={'Confirmar'}/>
                         </div>}/>
    )
}

const mapStateToProps = state => ({
    mongoClient: state.general.mongoClient,
});

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch({type: Actions.closeModal})
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalNewProfissional);