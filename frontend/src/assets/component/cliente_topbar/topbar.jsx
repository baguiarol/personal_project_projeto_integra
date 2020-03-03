import React from 'react';
import "./styles.sass";
import PropTypes from 'prop-types';
import {connect} from "react-redux";

const ClienteTopbar = props => {
    return (
        <div className={'topbar_container'}>
            <div className={'img_container'}>
                <img
                    alt={'logo'}
                    src={require('../../integra_logo.png')} />
            </div>
            <div className={'titulo'}>
                <h2>Portal da Equipe</h2>
                <h4>Agendamentos</h4>
            </div>
            <div className={'user_data'}>
                <div>
                    <h2>{props.userLogged ? props.userLogged.nome : 'Catherine Torres'}</h2>
                    <h4>{props.userLogged ? props.userLogged.ocupacao : 'Fisioterapeuta'}</h4>
                </div>
            </div>
            <img
                alt={'profile_pic'}
                className={'profile_pic'} src={
                    props.userLogged ?
                        props.userLogged.foto_url : 'https://randomuser.me/api/portraits/women/43.jpg'} />
        </div>
    )
}

ClienteTopbar.propTypes = {
    usuario: PropTypes.object,
}

const mapStateToProps = state => ({
    userLogged: state.general.userLogged,
})

export default connect(mapStateToProps)(ClienteTopbar);