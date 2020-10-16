import React from 'react';
import PropTypes from 'prop-types';
import './style.sass';

const InputText = props => {
    return (
        <div className={'input_text'} style={props.style}>
            <input
                placeholder={props.placeholder}
                onChange={props.onChange}
                step={'0.01'}
                style={props.inputStyle}
                value={props.value}
                required={props.required}
                disabled={props.disabled}
                defaultValue={props.defaultValue}
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
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    value: PropTypes.string,
    inputStyle: PropTypes.object,
    defaultValue: PropTypes.string,
    style: PropTypes.object,
    onChange: PropTypes.func,
}

export default InputText;