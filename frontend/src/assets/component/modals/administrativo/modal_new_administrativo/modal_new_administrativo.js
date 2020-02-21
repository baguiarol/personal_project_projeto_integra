import React from 'react';
import ModalParent from "../../modal_parent/modal";
import InputText from "../../../inputText/input";
import Button from "../../../button/button";
import "./modal_new_administrativo.sass";
import FileInput from "../../../file_input/FileInput";

const ModalNewAdministrativo = ({show, close}) => {

    const [loading, setLoading] = React.useState(false);
    const [file, setFile] = React.useState(null);
    const [fileURL, setFileURL] = React.useState('');

    const onSubmit = e => {
        const form = e.target;
        e.preventDefault();
        setLoading(true);

        setLoading(false);
    }

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
                         <FileInput
                             onChangeFile={(file, url) => {
                                 setFile(file);
                                 setFileURL(url);
                             }}
                             urlName={'foto_url'}
                             fileName={'userfile'} />
                         <InputText label={'Nome'} />
                         <InputText label={'Login'} />
                         <div className={'flex'}>
                             <InputText label={'Senha'} />
                             <InputText label={'Confirmar Senha'} />
                         </div>
                     </div>}
                     footer={
                         <div className={'footer'}>
                             <Button loading={loading} type={'submit'} text={'Confirmar'}/>
                         </div>}/>
    )
}

export default ModalNewAdministrativo;