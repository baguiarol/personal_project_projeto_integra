import React from 'react';
import PropTypes from 'prop-types';
import "./styles.sass";

const Button = props => {
    return (
        <button
            type={props.type}
            onClick={props.onClick}
            className={'button'}>
            {props.text}
        </button>
    );
}

Button.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    type: PropTypes.string,
}

export default Button;