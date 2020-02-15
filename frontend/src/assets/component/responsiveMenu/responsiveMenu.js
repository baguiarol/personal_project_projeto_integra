import React from 'react';
import PropTypes from 'prop-types';
import './responsiveMenu.sass';

const pages = [{
    pageName: 'dashboard',
    pageLabel: 'Dashboard',
}, {
    pageName: 'agendamento_adm',
    pageLabel: 'Agendamentos',
}, {
    pageName: 'administrativo',
    pageLabel: 'Administrativo',
}, {
    pageName: 'logs',
    pageLabel: 'Logs'
}, {
    pageName: 'profissionais',
    pageLabel: 'Profissionais'
},];

const ResponsiveMenu = ({pageSelected, onClick, open}) => {
    return (
        <div className={'responsive_menu ' + (open ? 'open': '')}>
            <ul>
                {pages.map(page => (
                    <li
                        onClick={onClick}
                        className={pageSelected === page.pageName ? 'selected' : ''}>
                        {page.pageLabel}
                    </li>
                ))}
            </ul>
        </div>
    )
};

ResponsiveMenu.propTypes = {
    pageSelected: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired
};

export default ResponsiveMenu;