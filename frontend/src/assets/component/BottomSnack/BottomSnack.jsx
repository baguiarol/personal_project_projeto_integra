import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import "./BottomSnack.sass"

const BottomSnack = props => {

    const [showing, setShowing] = React.useState(true);
    const [mounted, setMounted] = React.useState(true);

    const slideDown = async () =>
        await setTimeout(() => setShowing(false) , 3000);

    const unmount = async () =>
        await setTimeout(() => setMounted(false), 1000);

    React.useEffect(() => {
        slideDown().then(() => {
            unmount().then(() => {
                console.log('unmounted');
            });
        })
    }, [])

    const decideClassName = (tipo) => {
        if (tipo == 'carregando') {
            return 'loading'
        } else if (tipo == 'finalizado') {
            return 'finalizado'
        } else {
            return 'error'
        }
    }

    if (mounted) {
        return (
            <div className={showing ? 'snackbar' : 'snackbar shown'}>
                <p>
                <span className={decideClassName(props.tipo)}>
                    {props.tipo.toUpperCase()} ->
                </span>
                    <span>
                    {props.texto}
                </span>
                </p>
            </div>
        )
    } else {
        return null;
    }

}

BottomSnack.propTypes = {
    texto: PropTypes.string.isRequired,
    tipo: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(BottomSnack)