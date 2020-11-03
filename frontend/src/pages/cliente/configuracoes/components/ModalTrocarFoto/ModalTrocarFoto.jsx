import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import ModalParent from "../../../../../assets/component/modals/modal_parent/modal";
import FileInput from "../../../../../assets/component/file_input/FileInput";
import Button from "../../../../../assets/component/button/button";
import {post} from "axios";
import {checkIfURLIsImage} from "../../../../../assets/AuxFunctions";
import clienteDAO from "../../../../../DAO/clienteDAO";
import Actions from "../../../../../redux/actions/actions";

const ModalTrocarFoto = props => {

    const [loading, setLoading] = React.useState(false);
    const [file, setFile] = React.useState(null);
    const [fileURL, setFileURL] = React.useState('');

    const fileUpload = async (file) => {
        const url = 'https://app.integracps.com.br/imageUpload.php';
        const formData = new FormData();
        formData.append('userfile', file);
        const config = {headers: {'content-type': 'multipart/form-data'}};
        return post(url, formData, config);
    }

    return (
        <ModalParent show={props.show} onSubmit={async e => {
            e.preventDefault();
            if (checkIfURLIsImage(fileURL)) {
                try {
                    setLoading(true);
                    await fileUpload(file);
                    await clienteDAO.update({_id: props.userLogged._id}, {
                        foto_url: fileURL,
                    });
                    let user = await clienteDAO.find({_id: props.userLogged._id});
                    props.setUserLogged(user[0]);
                    setLoading(false);
                    alert('Foto editada com sucesso!')
                } catch (err) {
                    alert(err);
                }
            } else {
                alert('Informe uma imagem válida acima. Caso não queira adicionar uma imagem, deixe o campo em branco.');
            }
        }} header={<header>
            <div>
                <h1>Trocar Foto</h1>
            </div>
            <div className={'close_container'} onClick={props.close}>
                <i className={'fa fa-times'}/>
            </div>
        </header>}
                     body={<div>
                         <FileInput onChangeFile={(file, url) => {
                             setFile(file);
                             setFileURL(url);
                         }}
                                    urlName={'foto_url'}
                                    fileName={'userfile'}/>
                     </div>}
                     footer={<div className={'footer'}>
                         <Button loading={loading} type={'submit'} text={'Confirmar'}/>
                     </div>}
        />
    )
}

ModalTrocarFoto.propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func
}

const mapStateToProps = state => ({
    userLogged: state.general.userLogged,
})

const mapDispatchToProps = dispatch => ({
    setUserLogged: user => dispatch({type: Actions.setUserLogged, payload: user})
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalTrocarFoto)