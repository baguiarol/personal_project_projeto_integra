import React from 'react';
import PropTypes from 'prop-types';
import './LabelSelect.sass';
import Select from 'react-select';

const LabelSelect = (props) => {
  return (
    <div className={'labelSelect'} style={props.style}>
      <h3 className={'label'}>{props.label}</h3>
      <Select
        name={props.name}
        isMulti={props.isMulti}
        key={''}
        options={props.options}
      />
    </div>
  );
};

LabelSelect.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  isMulti: PropTypes.bool,
  name: PropTypes.string,
};

export default LabelSelect;
