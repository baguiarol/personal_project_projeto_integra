import React from 'react';
import ModalParent from "../../modal_parent/modal";
import FileInput from "../../../file_input/FileInput";
import InputText from "../../../inputText/input";
import Button from "../../../button/button";
import Actions from "../../../../../redux/actions/actions";
import {connect} from "react-redux";

const ModalNewSalas = props => {
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
                         <FileInput
                             onChangeFile={(file, url) => {
                                 setFile(file);
                                 setFileURL(url);
                             }}
                             urlName={'foto_url'}
                             fileName={'userfile'} />
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
};

const mapStateToProps = state => ({
    mongoClient: state.general.mongoClient,
});

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch({type: Actions.closeModal})
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalNewSalas)