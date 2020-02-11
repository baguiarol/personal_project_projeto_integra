import React from 'react';
import PropTypes from 'prop-types';
import "./styles.sass";

const ModalParent = props => {
    return (
        <div className={props.show ? 'modal_container' : 'modal_container hidden'}>
                {props.header}
            <div>
                {props.body}
            </div>
                {props.footer}
        </div>
    )
}

ModalParent.propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func,
    header: PropTypes.element,
    body: PropTypes.element,
    footer: PropTypes.element,
}

export default ModalParent;