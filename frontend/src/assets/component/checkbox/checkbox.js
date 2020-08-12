import React from 'react';
import PropTypes from 'prop-types';
import "./style.sass";

const CheckBox = ({onCheck = () => {}, label}) => {

    const [checked, setChecked] = React.useState(false);

    return (
        <div className={'checkbox_container'}>
            <div style={{flexGrow: 0}} className={checked ? 'checkbox checked' : 'checkbox'} onClick={() => {
                setChecked(!checked);
                onCheck(checked);
            }}>
            </div>
            <label>{label}</label>
        </div>
    )
};

CheckBox.propTypes = {
    onCheck: PropTypes.func,
    label: PropTypes.string.isRequired,
};

export default CheckBox;
