import React from 'react';
import Select from "react-select";
import ModalParent from "../../modal_parent/modal";
import InputText from "../../../inputText/input";
import Button from "../../../button/button";
import "./modal_new_administrativo.sass";

const ModalNewAdministrativo = ({show, close}) => {
    return (
        <ModalParent show={show}
                     header={<header>
                         <div>
                             <h1>Adicionar Administrativo</h1>
                         </div>
                         <div className={'close_container'} onClick={close}>
                             <i className={'fa fa-times'}/>
                         </div>
                     </header>}
                     body={<div>
                         <InputText label={'Foto URL'} />
                         <InputText label={'Nome'} />
                         <InputText label={'Login'} />
                         <div className={'flex'}>
                             <InputText label={'Senha'} />
                             <InputText label={'Confirmar Senha'} />
                         </div>
                     </div>}
                     footer={
                         <div className={'footer'}>
                             <Button text={'Confirmar'}/>
                         </div>}/>
    )
}

export default ModalNewAdministrativo;