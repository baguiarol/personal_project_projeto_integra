import React from 'react';
import ModalParent from "../../modal_parent/modal";
import FileInput from "../../../file_input/FileInput";
import InputText from "../../../inputText/input";
import Button from "../../../button/button";
import Actions from "../../../../../redux/actions/actions";
import {connect} from "react-redux";
import salaDAO from "../../../../../DAO/salaDAO";
import {post} from "axios";
import {checkIfURLIsImage} from "../../../../AuxFunctions";

const ModalNewSalas = ({show, closeModal, mongoClient, close, setSalas, salaSelected, unselectSala}) => {

    const [loading, setLoading] = React.useState(false);
    const [file, setFile] = React.useState(null);
    const [editing, setEditing] = React.useState(false);
    const [fileURL, setFileURL] = React.useState('');

    React.useEffect(() => {
        //Limpa dados do Input File quando troca de sala.
        setFile(null)
        setFileURL('')
    }, [salaSelected])

    const fileUpload = async (file) => {
        const url = 'https://teste.integracps.com.br/imageUpload.php';
        const formData = new FormData();
        formData.append('userfile', file);
        const config = {headers: {'content-type': 'multipart/form-data'}};
        return post(url, formData, config);
    }

    const newSala = async form => {
        if (checkIfURLIsImage(fileURL)) {
            try {
                await fileUpload(file);
                await salaDAO.create({
                    nome: form.nome.value,
                    descricao: form.descricao.value,
                    valor_hora: Number(form.valor_hora.value),
                    fotos: [fileURL],
                });
                alert('Sala adicionada com Sucesso!');
                closeModal();
            } catch (err) {
                alert(err);
            }
            setLoading(false);
        }
    }

    const editSala = async form => {
        try {
            let changes = {
                nome: form.nome.value,
                descricao: form.descricao.value,
                valor_hora: Number(form.valor_hora.value),
            }
            if (file) {
                if (checkIfURLIsImage(fileURL)) {
                    await fileUpload(file)
                    changes["fotos"] = [fileURL]
                }
            }
            await salaDAO.update({_id: salaSelected._id}, changes);
            alert('Sala editada com sucesso!');
            closeModal();
        } catch (err) {
            alert(err);
        }
        setLoading(false);
    };

    const removeSala = async () => {
        try {
            await salaDAO.delete({_id: salaSelected._id});
            alert('Sala removida com sucesso!');
            closeModal();
        } catch (err) {
            alert(err);
        }
        unselectSala();
        setLoading(false);
    }

    const onSubmit = async e => {
        e.preventDefault();
        const form = e.target;
        setLoading(true);
        if (!editing) {
            await newSala(form);
        } else {
            await editSala(form);
        }
        const salas = await salaDAO.findAll();
        setSalas(salas)
        unselectSala();
        setEditing(false);
        closeModal();
    };

    return (
        <ModalParent show={show}
                     onSubmit={onSubmit}
                     header={<header>
                         <div>
                             <h1>{'nome' in salaSelected ? 'Informações da Sala' : 'Adicionar Sala'}</h1>
                         </div>
                         <div className={'close_container'} onClick={() => {
                             close();
                             unselectSala();
                             setEditing(false);
                         }}>
                             <i className={'fa fa-times'}/>
                         </div>
                     </header>}
                     body={<div>
                         <FileInput onChangeFile={(file, url) => {
                             setFile(file);
                             setFileURL(url);
                         }}

                                    disabled={!(editing && 'nome' in salaSelected) || !('nome' in salaSelected)}
                                    fileName={'userfile'}
                                    urlName={'file_url'}/>
                         <InputText
                             disabled={'nome' in salaSelected && !editing}
                             defaultValue={salaSelected.nome}
                             label={"Nome"} name={'nome'} required/>
                         <InputText
                             disabled={'nome' in salaSelected && !editing}
                             defaultValue={salaSelected.descricao}
                             label={"Descrição"} name={'descricao'} required/>
                         <InputText
                             disabled={'nome' in salaSelected && !editing}
                             defaultValue={salaSelected.valor_hora}
                             label={'Valor da Hora'} name={'valor_hora'} type={'number'} required/>
                     </div>}
                     footer={
                         <div className={'footer'}>
                             {'nome' in salaSelected ?
                                 <div className={'flex crud_ops'}>
                                     <Button text={'Remover'} type={'button'} onClick={async () => {
                                         if (window.confirm("Tem certeza que deseja apagar essa sala do sistema?")) {
                                             await removeSala();
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
};

const mapStateToProps = state => ({
    mongoClient: state.general.mongoClient,
    salaSelected: state.salas.salaSelected,
});

const mapDispatchToProps = dispatch => ({
    closeModal: () => dispatch({type: Actions.closeModal}),
    unselectSala: () => dispatch({type: Actions.selectSala, payload: {}}),
    setSalas: () => dispatch({type: Actions.setSalas, payload: {}})
});

export default connect(mapStateToProps, mapDispatchToProps)(ModalNewSalas)