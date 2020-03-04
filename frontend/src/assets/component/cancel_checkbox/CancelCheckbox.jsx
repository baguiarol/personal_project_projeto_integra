import PropTypes from "prop-types";
import CheckBox from "../checkbox/checkbox";
import React from "react";
import './CancelCheckbox.sass';

const CancelCheckbox = ({ onCheck }) => {

    const [checked, setChecked] = React.useState(false);

    return (
        <div className={'cancel_checkbox_container'}>
            <div className={checked ? 'cancel_checkbox checked' : 'cancel_checkbox'} onClick={() => {
                setChecked(!checked);
                onCheck(checked);
            }}>
            </div>
        </div>
    )
}

CheckBox.propTypes = {
    onCheck: PropTypes.func.isRequired,
};

export default CancelCheckbox;