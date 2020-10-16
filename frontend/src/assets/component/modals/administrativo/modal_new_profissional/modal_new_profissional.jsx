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
                                  userLogged,
                                  closeModal,
                                  setProfissionais,
                                  profissionalSelected,
                                  selectProfissional,
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
        if (fileURL === '') {
            try {
                await clienteDAO.addUser(mongoClient, form.email.value, form.senha.value, {
                    nome: form.nome.value,
                    telefone: form.telefone.value,
                    ocupacao: form.ocupacao.value,
                    descricao: form.descricao.value,
                    foto_url: 'https://jsl-online.com/wp-content/uploads/2017/01/placeholder-user.png',
                    email: form.email.value.toLowerCase(),
                }, userLogged);
                setProfissionais(await clienteDAO.findAll());
                alert('Profissional Adicionado com Sucesso!')
            } catch(e) {
                alert(e)
            }
        } else {
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
                    }, userLogged);
                    setProfissionais(await clienteDAO.findAll());
                    alert('Profissional Adicionado com Sucesso!')
                } catch (err) {
                    alert(err);
                }
            } else {
                alert('Informe uma imagem válida acima. Caso não queira adicionar uma imagem, deixe o campo em branco.');
            }
        }
    }

    const editProfissional = async form => {
        try {
            let changes = {
                nome: form.nome.value,
                telefone: form.telefone.value,
                ocupacao: form.ocupacao.value,
                descricao: form.descricao.value,
                email: form.email.value,
            }
            if (fileURL !== '') {
                if (checkIfURLIsImage(fileURL)) {
                    await fileUpload(file)
                    changes["foto_url"] = fileURL
                } else {
                    alert('Erro! Imagem posta não tem formato correto.');
                    return ;
                }
            }
            if (form.email.value !== profissionalSelected.email) {
                await clienteDAO.registerAuth(mongoClient, changes.email, '123456');
            }
            await clienteDAO.update({_id: profissionalSelected._id}, changes);
            const profs = await clienteDAO.findAll();
            setProfissionais(profs);
            selectProfissional();
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
            if (form.senha.value !== form.confirmar_senha.value) {
                alert('Confirmação de senha não é igual a senha definida.')
            } else if (form.senha.value.length < 6 && form.senha.value.length > 128) {
                alert('A senha necessita conter entre 6 e 128 caracteres.')
            } else {
                await newProfissional(form);
                selectProfissional();
                setEditing(false);
                form.reset();
                closeModal();
            }
        } else {
            await editProfissional(form);
            selectProfissional();
            setEditing(false);
            form.reset();
            closeModal();
        }
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
                             disabled={!(editing && 'nome' in profissionalSelected) || !('nome' in profissionalSelected)}
                             urlName={'foto_url'}
                             fileName={'userfile'}/>
                         <InputText
                             disabled={'nome' in profissionalSelected && !editing}
                             defaultValue={profissionalSelected.nome}
                             required={true}
                             name={'nome'} label={'Nome'}/>
                         <div className={'flex'}>
                             <InputText
                                 disabled={'nome' in profissionalSelected && !editing}
                                 defaultValue={profissionalSelected.telefone}
                                 required={true}
                                 name={'telefone'}
                                 label={'Telefone'}/>
                             <InputText
                                 disabled={'nome' in profissionalSelected && !editing}
                                 defaultValue={profissionalSelected.ocupacao}
                                 name={'ocupacao'}
                                 label={'Ocupação'}/>
                         </div>
                         <InputText
                             required={true}
                             disabled={'nome' in profissionalSelected && !editing}
                             defaultValue={profissionalSelected.descricao}
                             name={'descricao'} label={'Descrição'}/>
                         <InputText name={'email'}
                                    required={true}
                                    disabled={'nome' in profissionalSelected && !editing}
                                    defaultValue={profissionalSelected.email}
                                    label={'Email'}
                                    placeholder={'E-mail utilizado para Login'}/>
                         {
                             'email' in profissionalSelected ? <></> :
                                 (
                                     <div className={'flex'}>
                                         <InputText label={'Senha'} name={'senha'} type={'password'} required={true} />
                                         <InputText name={'confirmar_senha'} label={'Confirmar Senha'} type={'password'} required={true}/>
                                     </div>)
                         }
                     </div>}
                     footer={
                         <div className={'footer'}>
                             {'nome' in profissionalSelected ?
                                 <div className={'flex crud_ops'}>
                                     <Button text={'Remover'} type={'button'} onClick={async () => {
                                         if (window.confirm("Tem certeza que deseja apagar esse profissional do sistema?")) {
                                             await removeProfissional();
                                             closeModal();
                                             selectProfissional()
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
    userLogged: state.general.userLogged,
    mongoClient: state.general.mongoClient,
    profissionalSelected: state.profissionais.profissionalSelected,
});

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch({type: Actions.closeModal}),
    setProfissionais: profs => dispatch({type: Actions.setProfissionais, payload: profs}),
    selectProfissional: () => dispatch({type: Actions.selectProfissional, payload: {}}),
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalNewProfissional);
