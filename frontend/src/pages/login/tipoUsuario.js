import React from 'react';
import {connect} from 'react-redux';
import "./tipoUsuario.sass"
import {useHistory} from "react-router";
import administradorDAO from "../../DAO/administradorDAO";

const TipoUsuario = props => {

    const story = useHistory()

    const [loading, setLoading] = React.useState(true)

    const checkAdm = async () => {
        setLoading(true)
        return administradorDAO.find({email: props.userLogged.email})
    }

    React.useEffect(() => {
        checkAdm().then(res => {
            if (res.length === 0) {
                story.push('/')
            }
            setLoading(false)
        })
    }, [])

    if (loading) {
        return (<div>
            <h1>Carregando...</h1>
        </div>)
    } else {
        return (
            <div>
                <div onClick={() => story.push('/agendamento_adm')}>
                    <h1>Entrar como Administrador</h1>
                </div>
                <div>
                    <h1>Entrar como Profissional</h1>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    userLogged: state.general.userLogged,
});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TipoUsuario);
