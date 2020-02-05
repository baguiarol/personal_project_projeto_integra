import React from 'react';
import PropTypes from 'prop-types';
import "./styles.sass";

const Tab = props => {
    return (
        <div className={'tab ' + (props.selected ? 'selected': '')}>
            <p>{props.children}</p>
        </div>
    )
};

const AdministradorTopbar = props => {
    return (
        <div className={'topbar_container'}>
            <div className={'img_container'}>
                <img src={require('../../integra_logo.png')}/>
            </div>
            <div className={'tabs'}>
                <Tab>Dashboard</Tab>
                <Tab selected>Agendamentos</Tab>
                <Tab>Salas</Tab>
            </div>
            <div className={'user_data'}>
                <div>
                    <h2>Catherine Torres</h2>
                    <h4>Fisioterapeuta</h4>
                </div>
            </div>
            <img className={'profile_pic'} src={'https://randomuser.me/api/portraits/women/43.jpg'}/>
        </div>
    )
};

export default AdministradorTopbar;