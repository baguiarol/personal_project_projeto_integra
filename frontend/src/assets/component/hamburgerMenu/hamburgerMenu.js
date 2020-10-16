import React from 'react';
import './hamburgerMenu.sass';
import PropTypes from 'prop-types';

const HamburgerMenu = props => {
    return (
        <div className={'hamburger_container'} onClick={props.onClick}>
            <div/>
            <div/>
            <div/>
        </div>
    )
}

HamburgerMenu.propTypes = {
    onClick: PropTypes.func,
}

export default HamburgerMenu;