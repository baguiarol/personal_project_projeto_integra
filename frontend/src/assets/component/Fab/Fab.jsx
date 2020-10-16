import React from 'react';
import PropTypes from 'prop-types';
import "./Fab.sass";
import {connect} from "react-redux";
import Actions from "../../../redux/actions/actions";

const Fab = props => {
    return (
        <div className={props.open ? 'Fab open' : 'Fab'} onClick={() => {
            props.onClick(props.open);
            props.selectAdministrador();
        } }>
            <i className={'fa fa-plus'} />
        </div>
    );
}

Fab.propTypes = {
    open: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
}

const mapDispatchToProps = dispatch => ({
    selectAdministrador: () => dispatch({type: Actions.selectAdministrador, payload: {}})
})

export default connect(null, mapDispatchToProps)(Fab);