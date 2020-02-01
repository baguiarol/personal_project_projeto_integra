import React from 'react';
import PropTypes from 'prop-types';
import "./style.sass";

const CheckBox = (props) => {

    const [checked, setChecked] = React.useState(false);

    return (
        <div className={'checkbox_container'}>
            <div className={checked ? 'checkbox checked' : 'checkbox'} onClick={() => { setChecked(!checked) }}>
            </div>
            <label>{props.label}</label>
        </div>
    )
};

CheckBox.propTypes = {
    onCheck: PropTypes.func,
    label: PropTypes.string.isRequired,
};

export default CheckBox;