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
import {checkIfURLIsImage} from "../../../../AuxFunctions";

const ModalNewProfissional = ({
                                  show,
                                  close,
                                  mongoClient,
                                  closeModal,
                                  setProfissionais,
                                  profissionalSelected,
                                  selectProfissional
                              }) => {

    const [loading, setLoading] = React.useState(false);
    const [file, setFile] = React.useState(null);
    const [editing, setEditing] = React.useState(false);
    const [fileURL, setFileURL] = React.useState('');

    const fileUpload = async (file) => {
        const url = 'https://teste.integracps.com.br/imageUpload.php';
        const formData = new FormData();
        formData.append('userfile', file);
        const config = {headers: {'content-type': 'multipart/form-data'}};
        return post(url, formData, config);
    }

    const newProfissional = async form => {
        if (checkIfURLIsImage(fileURL)) {
            try {
                await fileUpload(file);
                await clienteDAO.addUser(mongoClient, form.email.value, form.senha.value, {
                    nome: form.nome.value,
                    telefone: form.telefone.value,
                    ocupacao: form.ocupacao.value,
                    descricao: form.descricao.value,
                    foto_url: fileURL,
                    email: form.email.value,
                });
                setProfissionais(await clienteDAO.findAll());
                checkIfURLIsImage(fileURL);
                alert('Profissional Adicionado com Sucesso!')
            } catch (err) {
                alert(err);
            }
        } else {
            alert('Informe uma imagem válida acima');
        }
    }

    const editProfissional = async form => {
        try {
            await clienteDAO.update({_id: profissionalSelected._id}, {
                nome: form.nome.value,
                telefone: form.telefone.value,
                ocupacao: form.ocupacao.value,
                descricao: form.descricao.value,
                email: form.email.value,
            });
            const profs = await clienteDAO.findAll();
            setProfissionais(profs);
            alert('Profissional editado com Sucesso!')
        } catch (err) {
            alert(err);
        }
    };

    const removeProfissional = async () => {
        try {
            await clienteDAO.delete({_id: profissionalSelected._id})
            const profs = await clienteDAO.findAll();
            setProfissionais(profs);
            alert('Profissional removido com sucesso');
        } catch(err) {
            alert(err);
        }
    }

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        const form = e.target;
        if (!editing) {
            await newProfissional(form);
        } else {
            await editProfissional(form);
        }
        selectProfissional();
        setEditing(false);
        closeModal();
        setLoading(false);
    }

    return (
        <ModalParent show={show}
                     onSubmit={onSubmit}
                     header={<header>
                         <div>
                             <h1>{'nome' in profissionalSelected ? 'Informações do Profissional' : 'Adicionar Profissional'}</h1>
                         </div>
                         <div className={'close_container'} onClick={() => {
                             close();
                             selectProfissional();
                             setEditing(false);
                         }}>
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
                         <InputText
                             disabled={'nome' in profissionalSelected && !editing}
                             defaultValue={profissionalSelected.nome}
                             name={'nome'} label={'Nome'}/>
                         <div className={'flex'}>
                             <InputText
                                 disabled={'nome' in profissionalSelected && !editing}
                                 defaultValue={profissionalSelected.telefone}
                                 name={'telefone'}
                                 label={'Telefone'}/>
                             <InputText
                                 disabled={'nome' in profissionalSelected && !editing}
                                 defaultValue={profissionalSelected.ocupacao}
                                 name={'ocupacao'}
                                 label={'Ocupação'}/>
                         </div>
                         <InputText
                             disabled={'nome' in profissionalSelected && !editing}
                             defaultValue={profissionalSelected.descricao}
                             name={'descricao'} label={'Descrição'}/>
                         <InputText name={'email'}
                                    disabled={'nome' in profissionalSelected && !editing}
                                    defaultValue={profissionalSelected.email}
                                    label={'Email'}
                                    placeholder={'E-mail utilizado para Login'}/>
                         {
                             'email' in profissionalSelected ? <></> :
                                 (
                                     <div className={'flex'}>
                                         <InputText label={'Senha'} name={'senha'}/>
                                         <InputText label={'Confirmar Senha'}/>
                                     </div>)
                         }
                     </div>}
                     footer={
                         <div className={'footer'}>
                             {'nome' in profissionalSelected ?
                                 <div className={'flex crud_ops'}>
                                     <Button text={'Remover'} type={'button'} onClick={async () => {
                                         if (window.confirm("Tem certeza que deseja apagar esse administrador do sistema?")) {
                                             await removeProfissional();
                                             closeModal();
                                             setEditing(false);
                                         }
                                     }}/>
                                     <Button editing={editing}
                                             onClick={() => setEditing(true)}
                                             text={'Editar'}
                                             type={'button'}/>
                                 </div> : <></>}
                             <Button loading={loading} type={'submit'} text={'Confirmar'}/>
                         </div>}/>
    )
}

const mapStateToProps = state => ({
    mongoClient: state.general.mongoClient,
    profissionalSelected: state.profissionais.profissionalSelected,
});

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch({type: Actions.closeModal}),
    setProfissionais: profs => dispatch({type: Actions.setProfissionais, payload: profs}),
    selectProfissional: () => dispatch({type: Actions.selectProfissional, payload: {}}),
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalNewProfissional);