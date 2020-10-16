import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ModalParent from "../modal_parent/modal";
import InputText from "../../inputText/input";
import Button from "../../button/button";


const ForgotPasswordModal = props => {

    return (
        <ModalParent
            onSubmit={props.onSubmit} header={<header>
            <div>
                <h1>Recuperar Senha</h1>
            </div>
            <div className={'close_container'} onClick={props.onClose}>
                <i className={'fa fa-times'}/>
            </div>
        </header>} show={props.show} close={props.onClose} body={<div>
            <p style={{color: '#888'}}>Enviaremos para você um e-mail com link para redefinição.</p>
            <InputText label={'Seu e-mail'} name={'email'}/>
        </div>} footer={<div className={'footer'}>
            <Button loading={props.loading} type={'submit'} text={'Confirmar'}/>
        </div>}/>
    );
}

ForgotPasswordModal.propTypes = {};


const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordModal);
