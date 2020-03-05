import React from 'react';
import PropTypes from 'prop-types';
import "./styles.sass";

const Button = props => {
    return (
        <button
            type={props.type}
            style={props.width ? {width: props.width} : {}}
            onClick={props.onClick}
            editing={props.editing}
            disabled={props.loading || props.editing}
            className={(props.loading || props.editing) ?
                'button '+props.className+' loading' : 'button '+props.className }>
            { props.loading ? 'Carregando' : (props.editing ? 'Editando' : props.text)}
        </button>
    );
}

Button.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    type: PropTypes.string,
    width: PropTypes.string,
    editing: PropTypes.bool,
    className: PropTypes.string,
    loading: PropTypes.bool,
}

export default Button;