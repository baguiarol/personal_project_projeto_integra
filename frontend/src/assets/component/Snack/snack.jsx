import React from 'react';
import "./styles.sass";
import {connect} from "react-redux";

const Snack = props => {
    return (
        <div className={'snack_container'}>
            <h2>Você tem {props.profissionalReservas.length} reservas agendadas</h2>
        </div>)
}

const mapStateToProps = state => ({
    profissionalReservas: state.profissionais.profissionalReservas,
})

export default connect(mapStateToProps)(Snack);