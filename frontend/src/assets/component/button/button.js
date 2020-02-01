import React from 'react';
import PropTypes from 'prop-types';
import "./styles.sass";

const Button = props => {
    return (
        <button
            onClick={props.onClick}
            className={'button'}>
            {props.text}
        </button>
    );
}

Button.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
}

export default Button;