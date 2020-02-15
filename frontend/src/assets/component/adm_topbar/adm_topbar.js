import React from 'react';
import PropTypes from 'prop-types';
import "./styles.sass";
import {useHistory} from 'react-router-dom';
import HamburgerMenu from "../hamburgerMenu/hamburgerMenu";
import ResponsiveMenu from "../responsiveMenu/responsiveMenu";

const Tab = props => {
    const story = useHistory();

    return (
            <div onClick={() => {
                story.push('/' + props.page);
            }} className={'tab ' + (props.selected ? 'selected': '')}>
                <p>{props.children}</p>

            </div>
    )
};

const AdministradorTopbar = ({pageSelected}) => {

    const [hambOpen, setHambOpen] = React.useState(false);

    return (
        <div className={'topbar_container topbar_container_adm'}>
            <HamburgerMenu onClick={() => setHambOpen(true)}/>
            <ResponsiveMenu open={hambOpen} pageSelected={pageSelected} onClick={() => setHambOpen(false)}/>
            <div className={'img_container'}>
                <img src={require('../../integra_logo.png')}/>
            </div>
            <div className={'tabs'}>
                <Tab
                    page={'dashboard'}
                    selected={pageSelected === 'dashboard'}>
                    Dashboard
                </Tab>
                <Tab
                    page={'agendamento_adm'}
                    selected={pageSelected === 'agendamentos'}>
                    Agendamentos
                </Tab>
                <Tab page={'profissionais'} selected={pageSelected === 'profissionais'}>Profissionais</Tab>
                <Tab page={'administrativo'}  selected={pageSelected === 'administrativo'}>Administrativo</Tab>
                <Tab page={'salas'}  selected={pageSelected === 'salas'}>Salas</Tab>
                <Tab page={'logs'} selected={pageSelected === 'logs'}>Logs</Tab>
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

AdministradorTopbar.propTypes = {
    pageSelected: PropTypes.string.isRequired,
};

export default AdministradorTopbar;