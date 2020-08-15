import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import "./Configuracoes.sass"
import InputText from "../../../assets/component/inputText/input";
import Button from "../../../assets/component/button/button";
import ClienteTopbar from "../../../assets/component/cliente_topbar/topbar";
import {Link} from "react-router-dom";
import Select from "react-select";
import LabelSelect from "../../../assets/component/LabelSelect/LabelSelect";

const Configuracoes = props => {
    return (
        <div className={'configuracoes_container'}>
            <ClienteTopbar/>
            <div style={{marginTop: 35}}>
                <Link to={'/agendamentos'}><i className={'fas fa-chevron-left'}/> &nbsp; Voltar para Página
                    Inicial</Link>
            </div>
            <div className={'configuracoes_body'}>
                <div style={{display: 'flex', width: '100%', marginTop: 35}} >
                    <InputText style={{flexGrow: 1, marginRight: 15}} label={'Nome Completo'} />
                    <InputText style={{flexGrow: 1, marginRight: 15}} label={'Data de Nascimento'} />
                    <LabelSelect label={'Profissão'} style={{flexGrow: 1, marginRight: 15}}  options={[]}/>
                    <InputText label={'Nº de Registro'} style={{flexGrow: 1, marginRight: 15}} />
                </div>
                <div style={{display: 'flex', width: '100%', marginTop: 35}} >
                    <InputText style={{flexGrow: 1, marginRight: 15}} label={'CPF'} />
                    <InputText style={{flexGrow: 1, marginRight: 15}} label={'Telefone'} />
                    <InputText style={{flexGrow: 1, marginRight: 15}} label={'Endereço'} />
                    <InputText label={'CEP'} style={{flexGrow: 1, marginRight: 15}} />
                </div>
                <h2>Alterar Descrição</h2>
                <p>Sua descrição é seu currículo, você pode incluir o que você faz, sua formação acadêmica, e quanto tempo de experiência na área que você atua.</p>
                <p><textarea placeholder={'Sua nova descrição vai aqui.'} style={{width: '50%', height: 150, padding: 15}}/></p>
                <Button text={'Confirmar'} width={'250px'}/>
                <h2>Horários de Atendimento</h2>
                <p>Em construção...</p>
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
