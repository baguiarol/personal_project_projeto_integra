import React from 'react';
import "./styles.sass";
import PropTypes from 'prop-types';

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
                    <h2>Catherine Torres</h2>
                    <h4>Fisioterapeuta</h4>
                </div>
            </div>
            <img
                alt={'profile_pic'}
                className={'profile_pic'} src={'https://randomuser.me/api/portraits/women/43.jpg'} />
        </div>
    )
}

ClienteTopbar.propTypes = {
    usuario: PropTypes.object,
}

export default ClienteTopbar;