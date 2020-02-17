import React from 'react';
import ModalParent from "../../modal_parent/modal";
import InputText from "../../../inputText/input";
import Button from "../../../button/button";
import "./modal_new_profissional.sass";
import clienteDAO from "../../../../../DAO/clienteDAO";

const ModalNewProfissional = ({show, close, mongoClient}) => {

    const onSubmit = async e => {
        e.preventDefault();

        const form = e.target;
        try {
            await clienteDAO.addUser(mongoClient, form.email.value, form.senha.value, {
                nome: form.nome.value,
                telefone: form.telefone.value,
                ocupacao: form.ocupacao.value,
                descricao: form.descricao.value,
                email: form.email.value,
            });
        } catch(err) {
            alert(err);
        }
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
                         <InputText name={'foto_url'} label={'Foto URL'}/>
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
                             <Button type={'submit'} text={'Confirmar'}/>
                         </div>}/>
    )
}

const mapStateToProps = state => ({
    mongoClient: state.general.mongoClient,
});

const mapDispatchToProps = dispatch => ({});


export default ModalNewProfissional;