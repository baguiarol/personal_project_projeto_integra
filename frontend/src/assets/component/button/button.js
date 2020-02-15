import React from 'react';
import PropTypes from 'prop-types';
import "./styles.sass";

const Button = props => {
    return (
        <button
            type={props.type}
            style={props.width ? {width: props.width} : {}}
            onClick={props.onClick}
            className={'button '+props.className}>
            {props.text}
        </button>
    );
}

Button.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    type: PropTypes.string,
    width: PropTypes.string,
    className: PropTypes.string,
}

export default Button;