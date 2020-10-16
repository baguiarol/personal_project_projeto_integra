import React from 'react';
import PropTypes from 'prop-types';
import "./styles.sass";

const ModalParent = props => {

    const form = React.useRef();

    React.useEffect(() => {
        if (form.current) {
            setTimeout(() => {
                if (form.current) {
                    form.current.reset();
                }
            }, 300);
        }
    }, [props.show]);

    return (
        <div className={props.show ? 'modal_container' : 'modal_container hidden'}>
            {props.header}
            <form ref={form} onSubmit={props.onSubmit} encType={'multipart/form-data'}>
                <div>
                    {props.body}
                </div>
                {props.footer}
            </form>
        </div>
    )
}

ModalParent.propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func,
    header: PropTypes.element,
    body: PropTypes.element,
    footer: PropTypes.element,
    onSubmit: PropTypes.func,
}

export default ModalParent;