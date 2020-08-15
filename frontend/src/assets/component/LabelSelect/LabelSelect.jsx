import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import "./LabelSelect.sass"
import Select from "react-select";

const LabelSelect = props => {
 return (
    <div className={'labelSelect'} style={props.style}>
        <h3 className={'label'}>{props.label}</h3>
        <Select key={''} options={props.options} />
    </div>
 );
}

LabelSelect.propTypes = {
    label: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
}

export default LabelSelect
