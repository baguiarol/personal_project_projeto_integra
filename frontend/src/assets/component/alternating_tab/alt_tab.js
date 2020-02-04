import React from 'react';
import PropTypes from 'prop-types';
import "./styles.sass";

const AlternatingTab = props => {
    return (
        <div className={'alternating_tabs'}>
            {
                props.elements.map((element, index) => (
                    <div
                        className={index === props.selectedIndex ? 'selected' : ''}
                        onClick={element.onClick}>
                        <h2>{element.name}</h2>
                    </div>
                ))
            }
        </div>
    )
}

AlternatingTab.propTypes = {
    selectedIndex: PropTypes.number.isRequired,
    elements: PropTypes.array.isRequired
};

export default AlternatingTab;
