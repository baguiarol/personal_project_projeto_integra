import React from 'react';
import PropTypes from 'prop-types';
import "./Fab.sass";

const Fab = ({onClick, open}) => {
    return (
        <div className={open ? 'Fab open' : 'Fab'} onClick={() => { onClick(open); } }>
            <i className={'fa fa-plus'} />
        </div>
    );
}

Fab.propTypes = {
    open: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
}

export default Fab;