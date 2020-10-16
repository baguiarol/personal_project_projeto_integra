import React from 'react';
import "./resetPassword.sass"
import {connect} from 'react-redux';
import InputText from "../../../assets/component/inputText/input";
import Button from "../../../assets/component/button/button";
import qs from 'qs'
import {UserPasswordAuthProviderClient} from 'mongodb-stitch-browser-sdk'
import {useHistory} from "react-router";

const ResetPassword = props => {

    const story = useHistory()

    const [tokens, setTokens] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [succeded, setSucceded] =React.useState(false);

    React.useEffect(() => {
        const tokens = {
            token: qs.parse(props.location.search, {ignoreQueryPrefix: true}).token,
            tokenId: qs.parse(props.location.search).tokenId,
        }

        if (!tokens.token) {
            story.push('/')
        }
        setTokens(tokens)
        console.log(tokens)
    }, [])

    const onSubmit = async e => {
        e.preventDefault()
        const form = e.target
        const [senha, confSenha] = [form.nova_senha.value, form.conf_senha.value]
        if (senha !== confSenha) {
            alert('As senhas não conferem.')
        } else if (senha.length < 6) {
            alert('Por favor, insira uma senha com mais de 6 caracteres.')
        } else {
            //Passou.
            setLoading(true)
            try {
                const emailPassClient = props.mongoClient.auth.getProviderClient(UserPasswordAuthProviderClient.factory)
                await emailPassClient.resetPassword(tokens.token, tokens.tokenId, senha);
                setSucceded(true);
            } catch (e) {
                alert(e)
            }
            setLoading(false)
        }
    }

 return (
    <div className={'reset_password_container'}>
        <img src={require('../../../assets/integra_logo.png')} alt={''}/>
        {succeded ? (<div>
            <h1 style={{color: '#888', marginTop: 0}}>Sucesso!</h1>
        </div>) : (
            <form onSubmit={onSubmit}>
                <h1 style={{color: '#888', marginTop: 0}}>Redefinir Senha</h1>
                <InputText label={'Nova Senha'} type={'password'} name={'nova_senha'}/>
                <InputText label={'Confirmar Senha'} type={'password'} name={'conf_senha'}/>
                <Button text={'Confirmar'} type={'submit'} loading={loading} />
            </form>
        )}

    </div>
 );
}

const mapStateToProps = state => ({
    mongoClient: state.general.mongoClient
});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
