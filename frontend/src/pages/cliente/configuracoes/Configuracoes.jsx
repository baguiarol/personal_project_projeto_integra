import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import "./Configuracoes.sass"
import InputText from "../../../assets/component/inputText/input";
import Button from "../../../assets/component/button/button";
import ClienteTopbar from "../../../assets/component/cliente_topbar/topbar";
import {Link} from "react-router-dom";

const Configuracoes = props => {
    return (
        <div className={'configuracoes_container'}>
            <ClienteTopbar/>
            <div style={{marginTop: 35}}>
                <Link to={'/agendamentos'}><i className={'fas fa-chevron-left'}/> &nbsp; Voltar para Página
                    Inicial</Link>
            </div>
            <div className={'configuracoes_body'}>
                <h2>Alterar Descrição</h2>
                <p>Sua descrição é seu currículo, você pode incluir o que você faz, sua formação acadêmica, e quanto tempo de experiência na área que você atua.</p>
                <p><textarea placeholder={'Sua nova descrição vai aqui.'} style={{width: '50%', height: 150, padding: 15}}/></p>
                <Button text={'Confirmar'} width={'250px'}/>
                <h2>Recuperar Senha</h2>
                <p>Enviaremos um e-mail para seu e-mail cadastrado para redefinir a sua senha.</p>
                <Button text={'Enviar e-mail'} width={'350px'}/>
            </div>
        </div>
    );
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Configuracoes);
