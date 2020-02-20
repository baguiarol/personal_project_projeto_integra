import React from 'react';
import PropTypes from 'prop-types';
import './style.sass';

const InputText = props => {
    return (
        <div className={'input_text'} style={props.style}>
            <input
                placeholder={props.placeholder}
                type={props.type ? props.type : 'text'}
                name={props.name ? props.name : ''} />
            <label className={'label'}>{props.label}</label>
        </div>
    )
}

InputText.propTypes = {
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    style: PropTypes.object,
}

export default InputText;