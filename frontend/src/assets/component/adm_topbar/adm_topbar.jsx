import React from 'react';
import PropTypes from 'prop-types';
import './styles.sass';
import { useHistory } from 'react-router-dom';
import HamburgerMenu from '../hamburgerMenu/hamburgerMenu';
import ResponsiveMenu from '../responsiveMenu/responsiveMenu';
import { useDispatch, useSelector } from 'react-redux';
import { ActionsFn } from '../../../redux/actions/actions';
import Button from '../button/button';

const Tab = (props) => {
  const story = useHistory();

  return (
    <div
      onClick={() => {
        story.push('/' + props.page);
      }}
      className={'tab ' + (props.selected ? 'selected' : '')}
    >
      <p>{props.children}</p>
    </div>
  );
};

Tab.propTypes = {
  page: PropTypes.string,
  selected: PropTypes.bool,
  children: PropTypes.string,
};

const AdministradorTopbar = ({ pageSelected }) => {
  const [hambOpen, setHambOpen] = React.useState(false);

  const { userLogged } = useSelector((state) => state.general);
  const dispatch = useDispatch();

  const hist = useHistory();

  const pages = {
    dashboard: 'Dashboard',
    agendamento_adm: 'Agendamentos',
    profissionais: 'Profissionais',
    administrativo: 'Administrativo',
    cancelamentos: 'Cancelamentos',
    salas: 'Salas',
    logs: 'Logs',
  };

  const logout = () => {
    dispatch(ActionsFn.setUserLogged({}));
    localStorage.removeItem('email');
    localStorage.removeItem('pwd');
    hist.push('/');
  };

  return (
    <div className={'topbar_container topbar_container_adm'}>
      <HamburgerMenu onClick={() => setHambOpen(true)} />
      <ResponsiveMenu
        open={hambOpen}
        pageSelected={pageSelected}
        onClick={() => setHambOpen(false)}
      />
      <div className={'img_container'}>
        <div
          className={hambOpen ? 'hamb open' : 'hamb'}
          onClick={() => setHambOpen(!hambOpen)}
        >
          <div />
          <div />
          <div />
        </div>
        <img src={require('../../integra_g.png')} alt={''} />
      </div>
      <div className={hambOpen ? 'sidebar_adm open' : 'sidebar_adm'}>
        <Tab page={'dashboard'} selected={pageSelected === 'dashboard'}>
          Dashboard
        </Tab>
        <Tab
          page={'agendamento_adm'}
          selected={pageSelected === 'agendamento_adm'}
        >
          Agendamentos
        </Tab>
        <Tab page={'cancelamentos'} selected={pageSelected === 'cancelamentos'}>
          Cancelamentos
        </Tab>
        <Tab page={'profissionais'} selected={pageSelected === 'profissionais'}>
          Profissionais
        </Tab>
        <Tab
          page={'administrativo'}
          selected={pageSelected === 'administrativo'}
        >
          Administrativo
        </Tab>
        <Tab page={'salas'} selected={pageSelected === 'salas'}>
          Salas
        </Tab>
        <Tab page={'logs'} selected={pageSelected === 'logs'}>
          Logs
        </Tab>
      </div>
      <div className={'img_container_resp'}>
        <img alt={'integra_logo'} src={require('../../integra_logo.png')} />
      </div>
      <div className={'tabs'}>
        <h2 style={{ margin: 'auto' }}>{pages[pageSelected]}</h2>
      </div>
      <div className={'user_data'}>
        <div>
          <h2>{userLogged ? userLogged.nome : 'Catherine Torres'}</h2>
          <h4>Administrador</h4>
        </div>
      </div>
      <img
        alt={'profile_pic'}
        className={'profile_pic'}
        src={
          userLogged
            ? userLogged.foto_url
            : 'https://randomuser.me/api/portraits/women/43.jpg'
        }
      />
      <Button
        onClick={() => {
          logout();
        }}
        width={'5%'}
        text={<i className={'fas fa-door-open'} />}
        className={'log-off'}
      />
    </div>
  );
};

AdministradorTopbar.propTypes = {
  pageSelected: PropTypes.string.isRequired,
};

export default AdministradorTopbar;
